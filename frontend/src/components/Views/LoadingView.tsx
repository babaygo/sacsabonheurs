import { Spinner } from "../ui/spinner";

export function LoadingView() {
    return (
        <div className="min-h-screen flex items-center justify-center py-10 text-muted-foreground">
            <Spinner className="size-7" />
        </div>
    );
}
