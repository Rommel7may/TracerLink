import * as React from "react"

export interface SiteFooterProps {
    className?: string
    children?: React.ReactNode
    showFooter?: boolean
}

export function SiteFooter({ className = "", showFooter = true }: SiteFooterProps) {
    if (!showFooter) return null
    const team = [
        { name: "Rommel Aniciete", role: "UI/UX Designer/Frontend Developer" },
        { name: "Jhonamar Bernardo", role: "Backend Developer" },
        { name: "Riana Marie Manansala", role: "System Analyst/Technical Writer" },
        { name: "Andrew Manalansan", role: "Design Assistant/Financial Manager" },
        { name: "John Andrey Orogo", role: "Printing Officer/Financial Manager" },
        { name: "Aj Rafael", role: "Logistic Support/Financial Manager" },
    ]

    return (
        <footer className={`mx-auto w-full max-w-7xl px-4 ${className}`}>
            <div className="py-8 border-t mt-6 text-center">

                <p className="text-sm text-muted-foreground">
                     <span className="font-semibold">Alumni Tracerlink</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Developed by <span className="font-medium">BS in Information Technology - 4C</span>
                </p>
             


                {/* Team Members */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {team.map((member, index) => (
                        <div
                            key={index}
                            className="p-3 rounded-xl bg-muted/40 hover:bg-muted transition cursor-default"
                        >
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                            
                        </div>
                        
                    ))}
                </div>
            </div>
            <p className="p-5 text-center text-sm text-muted-foreground">&copy; 2025 Pampanga State University Lubao Campus. All rights reserved.</p>
        </footer>
    )
}

export default SiteFooter
