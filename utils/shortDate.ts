export default (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}
