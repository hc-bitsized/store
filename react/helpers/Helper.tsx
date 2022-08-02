export function formatPrice(value: number | undefined) {
    
    return value?.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'BRL',
    })
}