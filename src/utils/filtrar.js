export function filtrar(lista, { busqueda, generoSeleccionado, añoSeleccionado }) {
if (!lista || lista.length === 0) return []
let resultado = [...lista]

if (busqueda) {
    const texto = busqueda.toLowerCase()
    resultado = resultado.filter(i =>
    i.titulo?.toLowerCase().includes(texto) ||
    i.año?.toString().includes(texto) ||
    i.genero?.toLowerCase().includes(texto)
    )
}

if (añoSeleccionado) {
    resultado = resultado.filter(i => i.año === añoSeleccionado)
}

if (generoSeleccionado) {
    resultado = resultado.filter(i => i.genero === generoSeleccionado)
}

return resultado
}