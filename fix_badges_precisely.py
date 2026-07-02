import re

# 1. kaprodi/dosen/page.js
path = 'src/app/siakad/kaprodi/dosen/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                    <span style={{ 
                      background: d.status === 'Aktif' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      color: d.status === 'Aktif' ? '#10b981' : '#f59e0b', 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' 
                    }}>"""
replacement = """                    <span className="siakad-badge" style={{ 
                      background: d.status === 'Aktif' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      color: d.status === 'Aktif' ? '#10b981' : '#f59e0b' 
                    }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 2. kaprodi/kalender/page.js
path = 'src/app/siakad/kaprodi/kalender/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                    <span style={{ 
                      background: ev.type === 'Ujian' ? 'rgba(239, 68, 68, 0.1)' : ev.type === 'Dosen' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                      color: ev.type === 'Ujian' ? '#ef4444' : ev.type === 'Dosen' ? '#8b5cf6' : '#3b82f6', 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' 
                    }}>"""
replacement = """                    <span className="siakad-badge" style={{ 
                      background: ev.type === 'Ujian' ? 'rgba(239, 68, 68, 0.1)' : ev.type === 'Dosen' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                      color: ev.type === 'Ujian' ? '#ef4444' : ev.type === 'Dosen' ? '#8b5cf6' : '#3b82f6' 
                    }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 3. mahasiswa/keuangan/page.js
path = 'src/app/siakad/mahasiswa/keuangan/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        background: bill.status === 'Lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: bill.status === 'Lunas' ? '#10b981' : '#ef4444'
                      }}>"""
replacement = """                      <span className="siakad-badge" style={{
                        background: bill.status === 'Lunas' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: bill.status === 'Lunas' ? '#10b981' : '#ef4444'
                      }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 4. mahasiswa/surat/page.js
path = 'src/app/siakad/mahasiswa/surat/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                    <span style={{ 
                      padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold',
                      background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b',
                    }}>"""
replacement = """                    <span className="siakad-badge" style={{ 
                      background: req.status === 'Selesai' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Diproses' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: req.status === 'Selesai' ? '#10b981' : req.status === 'Diproses' ? '#3b82f6' : '#f59e0b'
                    }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 5. admin/keuangan/page.js
path = 'src/app/siakad/admin/keuangan/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700',
                        background: billing.status === 'Lunas' ? '#dcfce7' : '#fee2e2',
                        color: billing.status === 'Lunas' ? '#166534' : '#991b1b'
                      }}>"""
replacement = """                      <span className="siakad-badge" style={{
                        background: billing.status === 'Lunas' ? '#dcfce7' : '#fee2e2',
                        color: billing.status === 'Lunas' ? '#166534' : '#991b1b'
                      }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 6. kaprodi/kurikulum/page.js
path = 'src/app/siakad/kaprodi/kurikulum/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                    <span style={{ background: c.type === 'Wajib' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: c.type === 'Wajib' ? '#3b82f6' : '#f59e0b', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.type}</span>"""
replacement = """                    <span className="siakad-badge" style={{ background: c.type === 'Wajib' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: c.type === 'Wajib' ? '#3b82f6' : '#f59e0b' }}>{c.type}</span>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

# 7. kaprodi/monitoring/page.js
path = 'src/app/siakad/kaprodi/monitoring/page.js'
with open(path, 'r') as f:
    c = f.read()
target = """                        <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>"""
replacement = """                        <span className="siakad-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>"""
c = c.replace(target, replacement)
with open(path, 'w') as f:
    f.write(c)
print(f"Fixed {path}")

