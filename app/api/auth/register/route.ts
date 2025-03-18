import { NextResponse } from "next/server"

// In-memory user store
const users: any[] = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
  },
]

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Check if user exists
    const existingUser = users.find((user) => user.email === email)

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Create user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In a real app, this would be hashed
    }

    users.push(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ user: userWithoutPassword, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

