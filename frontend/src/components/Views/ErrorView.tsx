export function ErrorView({ error }: { error: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center py-10 text-red-500">
            <p>Erreur : {error}</p>
        </div>
    );
}
