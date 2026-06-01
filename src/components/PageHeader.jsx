// Header halaman (Page Header) yang memuat judul utama halaman dengan teks tebal besar, teks kategori kecil (eyebrow), deskripsi singkat halaman, serta tombol aksi cepat di sebelah kanan
function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export default PageHeader
