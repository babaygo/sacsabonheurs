"use client";

export default function Error() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur système !</h1>
            <p>Une erreur s'est produite, veuillez réessayer plus tard.</p>
        </div>
    )
}