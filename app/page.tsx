import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">School Finder</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Find the Perfect Kindergarten for Your Child</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our intelligent matching system helps you discover schools that align with your child's personality and
                your educational preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Personalized Matching</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your child's personality to find schools where they'll thrive.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Comprehensive Database</h3>
                <p className="text-muted-foreground">
                  Search through our extensive database of kindergartens with detailed information.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Easy Comparison</h3>
                <p className="text-muted-foreground">
                  Compare schools side by side to make the best decision for your child's education.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} School Finder. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

