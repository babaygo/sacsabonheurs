import Link from "next/link";

type Crumb = {
    label: string;
    href?: string;
};

type BreadCrumbProps = {
    items: Crumb[];
};

export default function BreadCrumb({ items }: BreadCrumbProps) {
    return (
        <nav aria-label="Fil d'Ariane" className="text-sm pb-6">
            <ol className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                        {item.href ? (
                            <Link href={item.href} className="hover:underline">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-semibold">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span>&gt;</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
