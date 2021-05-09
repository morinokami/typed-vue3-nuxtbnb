export default (n: number, singularWord: string) => {
  const text = `${n} ${singularWord}`
  return n === 1 ? text : text + 's'
}
