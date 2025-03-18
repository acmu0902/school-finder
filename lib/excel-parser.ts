import * as XLSX from "xlsx"
import path from "path"
import fs from "fs"

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

export async function parseExcelFile(): Promise<School[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "kindergartenversion2.xlsx")
    const fileBuffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(fileBuffer, { type: "buffer" })

    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json<School>(worksheet)

    return data
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    return []
  }
}

