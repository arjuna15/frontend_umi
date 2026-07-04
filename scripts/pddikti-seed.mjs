#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_UNIVERSITY = 'Universitas Mitra Bangsa';
const TARGET_PRODI = [
  'ILMU KOMPUTER',
  'ILMU AKTUARIA',
  'SISTEM DAN TEKNOLOGI INFORMASI',
];
const TARGET_SEARCH_TERMS = [
  'Ilmu Komputer',
  'Ilmu Komputer UMIBA',
  'Ilmu Aktuaria',
  'Ilmu Aktuaria UMIBA',
  'Sistem Teknologi Informasi',
  'Sistem dan Teknologi Informasi',
  'Sistem Teknologi Informasi UMIBA',
  'Sistem dan Teknologi Informasi UMIBA',
];
const BASE_URLS = [
  process.env.PDDIKTI_BASE_URL,
  'https://pddikti.fastapicloud.dev',
  'https://pddikti.rone.dev',
].filter(Boolean);
const UNIVERSITY_NAME = process.env.PDDIKTI_UNIVERSITY || DEFAULT_UNIVERSITY;
const OUTPUT_DIR = process.env.PDDIKTI_OUTPUT_DIR
  ? path.resolve(process.env.PDDIKTI_OUTPUT_DIR)
  : path.join(process.cwd(), 'data', 'pddikti');
const REQUEST_DELAY_MIN = Number(process.env.PDDIKTI_DELAY_MIN || 300);
const REQUEST_DELAY_MAX = Number(process.env.PDDIKTI_DELAY_MAX || 500);
const MAX_RETRIES = Number(process.env.PDDIKTI_MAX_RETRIES || 3);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => Math.floor(Math.random() * (REQUEST_DELAY_MAX - REQUEST_DELAY_MIN + 1)) + REQUEST_DELAY_MIN;

const normalizeText = (value) => String(value || '')
  .trim()
  .replace(/\s+/g, ' ')
  .toUpperCase();

const isUMBAffiliated = (item = {}) => {
  const pt = normalizeText(item.nama_pt || item.pt || '');
  const short = normalizeText(item.sinkatan_pt || item.pt_singkat || '');
  return pt.includes('MITRA BANGSA') || short === 'UMIBA';
};

const isTargetProdi = (item = {}) => TARGET_PRODI.includes(normalizeText(item.nama_prodi || item.nama || item.prodi || ''));

const uniqById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id || item?.id_sdm || item?.id_mhs || item?.id_sms || item?.id_prodi || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

async function fetchJson(baseUrl, apiPath) {
  const url = `${baseUrl}${apiPath}`;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (seed-script; +https://github.com/arjuna15/frontend_umi)',
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        const err = new Error(`HTTP ${res.status} for ${url}${body ? ` :: ${body.slice(0, 180)}` : ''}`);
        err.status = res.status;
        throw err;
      }

      return await res.json();
    } catch (error) {
      lastError = error;
      const retryable = [429, 500, 502, 503, 504].includes(Number(error?.status));
      const shouldRetry = attempt < MAX_RETRIES && retryable;
      if (!shouldRetry) break;
      const backoff = REQUEST_DELAY_MIN + (attempt * 500);
      console.warn(`[retry ${attempt}/${MAX_RETRIES}] ${url} -> ${error.message}; waiting ${backoff}ms`);
      await sleep(backoff);
    }
  }

  throw lastError;
}

async function fetchFromAnyBase(apiPath) {
  let lastError;
  for (const baseUrl of BASE_URLS) {
    try {
      return await fetchJson(baseUrl, apiPath);
    } catch (error) {
      lastError = error;
      console.warn(`[warn] ${baseUrl}${apiPath} failed: ${error.message}`);
    }
  }
  throw lastError;
}

function normalizeSearchResponse(data, key) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return [];
}

function choosePt(list) {
  const items = Array.isArray(list) ? list : [];
  const exact = items.find((item) => normalizeText(item.nama) === normalizeText(UNIVERSITY_NAME));
  if (exact) return exact;
  const short = items.find((item) => normalizeText(item.nama_singkat) === 'UMIBA');
  if (short) return short;
  return items[0] || null;
}

function mapStudentStatus(statusText) {
  const status = normalizeText(statusText);
  if (status.includes('AKTIF')) return 'aktif';
  if (status.includes('LULUS') || status.includes('GRADUATE') || status.includes('YUDISIUM')) return 'lulus';
  return 'keluar';
}

async function getPtData() {
  const ptSearch = await fetchFromAnyBase(`/api/search/pt/${encodeURIComponent(UNIVERSITY_NAME)}/`);
  const pt = choosePt(ptSearch);
  if (!pt) {
    throw new Error(`Universitas "${UNIVERSITY_NAME}" tidak ditemukan di search/pt`);
  }
  const detail = await fetchFromAnyBase(`/api/pt/detail/${pt.id}/`);
  return { ptSearch, pt, detail };
}

async function getProdiList() {
  const raw = await fetchFromAnyBase(`/api/search/prodi/${encodeURIComponent(UNIVERSITY_NAME)}/`);
  const items = normalizeSearchResponse(raw, 'prodi').filter(isUMBAffiliated);
  const unique = uniqById(items);
  return unique;
}

async function collectCandidates(prodiList, ptSearchAll) {
  const searchTerms = [
    UNIVERSITY_NAME,
    ...TARGET_SEARCH_TERMS,
    ...new Set(prodiList.map((item) => item.nama).filter(Boolean)),
  ];
  const dosenCandidates = [];
  const mahasiswaCandidates = [];

  if (ptSearchAll) {
    dosenCandidates.push(...normalizeSearchResponse(ptSearchAll, 'dosen'));
    mahasiswaCandidates.push(...normalizeSearchResponse(ptSearchAll, 'mahasiswa'));
  }

  for (const term of searchTerms) {
    const encoded = encodeURIComponent(term);
    const [dosenRes, mhsRes] = await Promise.all([
      fetchFromAnyBase(`/api/search/dosen/${encoded}/`).catch((err) => {
        console.warn(`[skip] search/dosen/${term}: ${err.message}`);
        return [];
      }),
      fetchFromAnyBase(`/api/search/mhs/${encoded}/`).catch((err) => {
        console.warn(`[skip] search/mhs/${term}: ${err.message}`);
        return [];
      }),
    ]);

    dosenCandidates.push(...normalizeSearchResponse(dosenRes, 'dosen'));
    mahasiswaCandidates.push(...normalizeSearchResponse(mhsRes, 'mahasiswa'));
    await sleep(randomDelay());
  }

  return {
    dosen: uniqById(dosenCandidates).filter((item) => isUMBAffiliated(item) && isTargetProdi(item)),
    mahasiswa: uniqById(mahasiswaCandidates).filter((item) => isUMBAffiliated(item) && isTargetProdi(item)),
  };
}

async function fetchLecturerDetails(candidates) {
  const out = [];
  for (const candidate of candidates) {
    if (!candidate?.id) continue;
    try {
      const profile = await fetchFromAnyBase(`/api/dosen/profile/${candidate.id}/`);
      out.push({
        nama: profile.nama_dosen || candidate.nama || '-',
        nidn: candidate.nidn || '',
        nama_prodi: profile.nama_prodi || candidate.nama_prodi || '-',
        nama_pt: profile.nama_pt || candidate.nama_pt || '-',
      });
      console.log(`[dosen] ${candidate.nama || candidate.id}`);
    } catch (error) {
      console.warn(`[skip dosen] ${candidate.nama || candidate.id}: ${error.message}`);
    }
    await sleep(randomDelay());
  }
  return out;
}

async function fetchStudentDetails(candidates) {
  const out = [];
  for (const candidate of candidates) {
    if (!candidate?.id) continue;
    try {
      const detail = await fetchFromAnyBase(`/api/mhs/detail/${candidate.id}/`);
      out.push({
        nama: detail.nama || candidate.nama || '-',
        nim: detail.nim || candidate.nim || '',
        nama_prodi: detail.prodi || candidate.nama_prodi || '-',
        status: mapStudentStatus(detail.status_saat_ini),
      });
      console.log(`[mhs] ${candidate.nama || candidate.id}`);
    } catch (error) {
      console.warn(`[skip mhs] ${candidate.nama || candidate.id}: ${error.message}`);
    }
    await sleep(randomDelay());
  }
  return out;
}

async function main() {
  console.log(`Target PT: ${UNIVERSITY_NAME}`);
  console.log(`Base URLs: ${BASE_URLS.join(', ')}`);
  await mkdir(OUTPUT_DIR, { recursive: true });

  const { pt, detail } = await getPtData();
  console.log(`PT ditemukan: ${detail.nama_pt} (${pt.kode || detail.kode_pt || 'n/a'})`);

  const prodiList = await getProdiList();
  console.log(`Prodi terdeteksi: ${prodiList.length}`);
  prodiList.forEach((item) => console.log(`- ${item.nama} ${item.jenjang || ''}`.trim()));

  const ptSearchAll = await fetchFromAnyBase(`/api/search/all/${encodeURIComponent(UNIVERSITY_NAME)}/`);
  const candidates = await collectCandidates(prodiList, ptSearchAll);

  console.log(`Candidate dosen: ${candidates.dosen.length}`);
  console.log(`Candidate mahasiswa: ${candidates.mahasiswa.length}`);

  const dosen = uniqById(await fetchLecturerDetails(candidates.dosen));
  const mahasiswa = uniqById(await fetchStudentDetails(candidates.mahasiswa));

  dosen.sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'));
  mahasiswa.sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'));

  await writeFile(path.join(OUTPUT_DIR, 'dosen.json'), JSON.stringify(dosen, null, 2) + '\n');
  await writeFile(path.join(OUTPUT_DIR, 'mahasiswa.json'), JSON.stringify(mahasiswa, null, 2) + '\n');

  console.log(`Saved ${dosen.length} dosen -> ${path.join(OUTPUT_DIR, 'dosen.json')}`);
  console.log(`Saved ${mahasiswa.length} mahasiswa -> ${path.join(OUTPUT_DIR, 'mahasiswa.json')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
