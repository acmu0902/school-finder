export interface School {
  name: string
  address: string
  phone: string
  website: string
  teachingMethods: string
  features: string
  curriculum: string
  learningExperience: string
  gender: string
}

export async function getSchoolsData(): Promise<School[]> {
  // Replace with your Google Sheet ID
  const sheetId = "1lN248cbTrUuifq1FrHYnl1ypmUWOwyVY4xyvca1BZ3w"
  const sheetName = "Sheet1" // Change if your sheet has a different name

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`

  try {
    const response = await fetch(url)
    const text = await response.text()

    // Google's response comes with some extra characters we need to remove
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}") + 1
    const jsonString = text.substring(jsonStart, jsonEnd)
    const jsonData = JSON.parse(jsonString)

    // Transform the data into our School format
    const schools: School[] = []

    // Skip the header row (index 0)
    for (let i = 1; i < jsonData.table.rows.length; i++) {
      const row = jsonData.table.rows[i]
      const cells = row.c

      // Only add rows that have data
      if (cells && cells[0] && cells[0].v) {
        schools.push({
          name: cells[0]?.v || "",
          address: cells[1]?.v || "",
          phone: cells[2]?.v || "",
          website: cells[3]?.v || "",
          teachingMethods: cells[4]?.v || "",
          features: cells[5]?.v || "",
          curriculum: cells[6]?.v || "",
          learningExperience: cells[7]?.v || "",
          gender: cells[8]?.v || "",
        })
      }
    }

    return schools
  } catch (error) {
    console.error("Error fetching Google Sheet:", error)
    return []
  }
}

