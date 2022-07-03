function downloadFile(fileContent = "") {
  const url = window.URL.createObjectURL(new Blob([fileContent]))

  const link = document.createElement("a")

  link.href = url
  link.setAttribute("download", "mytrack.gpx")
  document.body.appendChild(link)
  link.click()
}

export default { downloadFile }
