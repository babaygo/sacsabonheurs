"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur système !</h1>
            <div>{error.message}</div>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}