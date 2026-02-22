from pypdf import PdfReader
p = r"C:\Users\NeilEdwardBaja\Desktop\UGC ORG CHART (8) [Recovered].pdf"
r = PdfReader(p)
print('PAGES', len(r.pages))
for i, pg in enumerate(r.pages, 1):
    t = pg.extract_text() or ''
    print(f'--- PAGE {i} CHARS {len(t)} ---')
    print((t[:3000]).replace('\n', ' | '))
