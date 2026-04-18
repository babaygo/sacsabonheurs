"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import HardBreak from "@tiptap/extension-hard-break";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";
import { useEffect, useState, type ReactNode } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    ChevronDown,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListChevronsUpDown,
    ListOrdered,
    Minus,
    Redo,
    Underline,
    Undo,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    variant?: "site" | "blog";
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
const LINE_HEIGHT_OPTIONS = [
    { label: "1", value: "1" },
    { label: "1,15", value: "1.15" },
    { label: "1,5", value: "1.5" },
    { label: "2", value: "2" },
];
const COLOR_OPTIONS = [
    { label: "Encre", value: "var(--rte-color-ink)" },
    { label: "Primaire", value: "var(--rte-color-primary)" },
    { label: "Accent", value: "var(--rte-color-accent)" },
    { label: "Muted", value: "var(--rte-color-muted)" },
    { label: "Creme", value: "var(--rte-color-cream)" },
    { label: "Alerte", value: "var(--rte-color-destructive)" },
];

function ToolbarButton({
    label,
    onClick,
    active = false,
    disabled = false,
    children,
}: {
    label: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: ReactNode;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`h-8 w-8 bg-card hover:bg-card ${active ? "border-primary text-primary ring-1 ring-primary/15" : ""}`}
        >
            {children}
        </Button>
    );
}

export function RichTextEditor({ value, onChange, variant = "site" }: RichTextEditorProps) {
    const [selectedFontSize, setSelectedFontSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedLineHeight, setSelectedLineHeight] = useState("");
    const [selectedParagraphBefore, setSelectedParagraphBefore] = useState("");
    const [selectedParagraphAfter, setSelectedParagraphAfter] = useState("");

    const [selectedAlignTool, setSelectedAlignTool] = useState("");
    const [selectedHeadingTool, setSelectedHeadingTool] = useState("");
    const [selectedListTool, setSelectedListTool] = useState("");
    const [, forceToolbarRefresh] = useState(0);
    const FontSize = Extension.create({
        name: "fontSize",
        addGlobalAttributes() {
            return [
                {
                    types: ["textStyle"],
                    attributes: {
                        fontSize: {
                            default: null,
                            parseHTML: (element) => element.style.fontSize || null,
                            renderHTML: (attributes) => {
                                if (!attributes.fontSize) {
                                    return {};
                                }
                                return { style: `font-size: ${attributes.fontSize}` };
                            },
                        },
                    },
                },
            ];
        },
    });

    const ParagraphSpacing = Extension.create({
        name: "paragraphSpacing",
        addGlobalAttributes() {
            const buildParagraphStyle = (attributes: {
                lineHeight?: string | null;
                marginTop?: string | null;
                marginBottom?: string | null;
            }) => {
                const styles = [
                    attributes.lineHeight ? `line-height: ${attributes.lineHeight}` : null,
                    attributes.marginTop ? `margin-top: ${attributes.marginTop}` : null,
                    attributes.marginBottom ? `margin-bottom: ${attributes.marginBottom}` : null,
                ].filter(Boolean);

                if (styles.length === 0) {
                    return {};
                }

                return { style: styles.join("; ") };
            };

            return [
                {
                    types: ["paragraph"],
                    attributes: {
                        lineHeight: {
                            default: null,
                            parseHTML: (element) => element.style.lineHeight || null,
                            renderHTML: (attributes) => buildParagraphStyle(attributes),
                        },
                        marginTop: {
                            default: null,
                            parseHTML: (element) => element.style.marginTop || null,
                            renderHTML: (attributes) => buildParagraphStyle(attributes),
                        },
                        marginBottom: {
                            default: null,
                            parseHTML: (element) => element.style.marginBottom || null,
                            renderHTML: (attributes) => buildParagraphStyle(attributes),
                        },
                    },
                },
            ];
        },
    });

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                },
            }),
            TextStyle,
            FontSize,
            ParagraphSpacing,
            Color,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            HardBreak
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "rich-editor-content max-w-none min-h-[200px] p-4 focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const syncToolbarState = () => {
            const textStyle = editor.getAttributes("textStyle");
            const paragraphStyle = editor.getAttributes("paragraph");
            const alignTool = editor.isActive({ textAlign: "left" })
                ? "left"
                : editor.isActive({ textAlign: "center" })
                    ? "center"
                    : editor.isActive({ textAlign: "right" })
                        ? "right"
                        : editor.isActive({ textAlign: "justify" })
                            ? "justify"
                            : "";
            const headingTool = editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                    ? "h2"
                    : editor.isActive("heading", { level: 3 })
                        ? "h3"
                        : "";
            const listTool = editor.isActive("bulletList")
                ? "bullet"
                : editor.isActive("orderedList")
                    ? "ordered"
                    : "";

            setSelectedFontSize(textStyle.fontSize || "16px");
            setSelectedColor(textStyle.color || "var(--rte-color-ink)");
            setSelectedLineHeight(paragraphStyle.lineHeight || "");
            setSelectedParagraphBefore(paragraphStyle.marginTop || "0px");
            setSelectedParagraphAfter(paragraphStyle.marginBottom || "12px");
            setSelectedAlignTool(alignTool);
            setSelectedHeadingTool(headingTool);
            setSelectedListTool(listTool);
            forceToolbarRefresh((tick) => tick + 1);
        };

        syncToolbarState();
        editor.on("selectionUpdate", syncToolbarState);
        editor.on("transaction", syncToolbarState);

        return () => {
            editor.off("selectionUpdate", syncToolbarState);
            editor.off("transaction", syncToolbarState);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const plainText = editor.getText().replace(/\s+/g, " ").trim();
    const wordCount = plainText ? plainText.split(" ").length : 0;
    const characterCount = plainText.length;

    const setFontSize = (size: string) => {
        const currentSize = editor.getAttributes("textStyle").fontSize;
        if (currentSize === size) {
            editor.chain().focus().setMark("textStyle", { fontSize: null }).run();
            return;
        }
        editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    };

    const setTextColor = (color: string) => {
        const currentColor = editor.getAttributes("textStyle").color;
        if (currentColor === color) {
            editor.chain().focus().unsetColor().run();
            return;
        }
        editor.chain().focus().setColor(color).run();
    };

    const setLineHeight = (lineHeight: string) => {
        const currentLineHeight = editor.getAttributes("paragraph").lineHeight;
        if (currentLineHeight === lineHeight) {
            editor.chain().focus().updateAttributes("paragraph", { lineHeight: null }).run();
            return;
        }
        editor.chain().focus().updateAttributes("paragraph", { lineHeight }).run();
    };

    const setParagraphBeforeSpacing = (marginTop: string) => {
        editor.chain().focus().updateAttributes("paragraph", { marginTop }).run();
    };

    const setParagraphAfterSpacing = (marginBottom: string) => {
        editor.chain().focus().updateAttributes("paragraph", { marginBottom }).run();
    };

    const hasParagraphBefore = selectedParagraphBefore !== "0px" && selectedParagraphBefore !== "";
    const hasParagraphAfter = selectedParagraphAfter !== "0px" && selectedParagraphAfter !== "";

    const toggleParagraphBefore = () => {
        const newValue = hasParagraphBefore ? "0px" : "12px";
        setParagraphBeforeSpacing(newValue);
    };

    const toggleParagraphAfter = () => {
        const newValue = hasParagraphAfter ? "0px" : "12px";
        setParagraphAfterSpacing(newValue);
    };

    const addLink = () => {
        const currentHref = editor.getAttributes("link").href || "";
        const rawValue = window.prompt(
            "URL du lien (laisser vide pour supprimer) :",
            currentHref
        );

        if (rawValue === null) {
            return;
        }

        const url = rawValue.trim();

        if (!url) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        const normalizedUrl = /^(https?:\/\/|mailto:|tel:)/i.test(url)
            ? url
            : `https://${url}`;

        editor.chain().focus().extendMarkRange("link").setLink({ href: normalizedUrl }).run();
    };



    const applyAlignTool = (tool: string) => {
        if (tool === "default") {
            editor.chain().focus().unsetTextAlign().run();
            setSelectedAlignTool("");
            return;
        }

        if (tool === "left") {
            editor.chain().focus().setTextAlign("left").run();
        }
        if (tool === "center") {
            editor.chain().focus().setTextAlign("center").run();
        }
        if (tool === "right") {
            editor.chain().focus().setTextAlign("right").run();
        }
        if (tool === "justify") {
            editor.chain().focus().setTextAlign("justify").run();
        }
    };

    const applyHeadingTool = (tool: string) => {
        if (tool === "paragraph") {
            editor.chain().focus().setParagraph().run();
            setSelectedHeadingTool("");
            return;
        }

        if (tool === "h1") {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
        }
        if (tool === "h2") {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
        if (tool === "h3") {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
    };

    const applyListTool = (tool: string) => {
        if (tool === "none") {
            if (editor.isActive("bulletList")) {
                editor.chain().focus().toggleBulletList().run();
            }
            if (editor.isActive("orderedList")) {
                editor.chain().focus().toggleOrderedList().run();
            }
            setSelectedListTool("");
            return;
        }

        if (tool === "bullet") {
            editor.chain().focus().toggleBulletList().run();
        }
        if (tool === "ordered") {
            editor.chain().focus().toggleOrderedList().run();
        }
    };

    const clearFormatting = () => {
        editor
            .chain()
            .focus()
            .unsetAllMarks()
            .clearNodes()
            .unsetTextAlign()
            .updateAttributes("paragraph", {
                lineHeight: null,
                marginTop: null,
                marginBottom: null,
            })
            .run();
    };

    return (
        <div className="overflow-hidden rounded-md border border-border bg-card shadow-xs transition-shadow focus-within:ring-2 focus-within:ring-ring/30">
            {/* Barre d'outils */}
            <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
                <Select value={selectedFontSize || undefined} onValueChange={setFontSize}>
                    <SelectTrigger className="h-8 w-[110px] bg-card hover:bg-card data-[state=open]:bg-card">
                        <SelectValue placeholder="Taille" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedColor || undefined} onValueChange={setTextColor}>
                    <SelectTrigger className="h-8 w-[140px] bg-card hover:bg-card data-[state=open]:bg-card">
                        <SelectValue placeholder="Couleur" />
                    </SelectTrigger>
                    <SelectContent>
                        {COLOR_OPTIONS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full border border-border"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    {color.label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className="h-8 gap-1 bg-card px-2 hover:bg-card">
                            <ListChevronsUpDown className="h-4 w-4" />
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[280px]">
                        {LINE_HEIGHT_OPTIONS.map((opt) => (
                            <DropdownMenuCheckboxItem
                                key={opt.value}
                                checked={selectedLineHeight === opt.value}
                                onCheckedChange={() => setLineHeight(opt.value)}
                            >
                                {opt.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={hasParagraphBefore}
                            onCheckedChange={toggleParagraphBefore}
                        >
                            Insérer un espacement avant le paragraphe
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={hasParagraphAfter}
                            onCheckedChange={toggleParagraphAfter}
                        >
                            Insérer un espacement après le paragraphe
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Select value={selectedAlignTool || undefined} onValueChange={applyAlignTool}>
                    <SelectTrigger className="h-8 w-[56px] bg-card hover:bg-card data-[state=open]:bg-card" aria-label="Alignement">
                        <SelectValue
                            placeholder={
                                <span className="inline-flex items-center justify-center w-full">
                                    <AlignLeft className="h-4 w-4" />
                                    <span className="sr-only">Alignement</span>
                                </span>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            <span className="inline-flex items-center gap-2">
                                <AlignLeft className="h-4 w-4" />
                                Alignement par défaut
                            </span>
                        </SelectItem>
                        <SelectItem value="left">
                            <span className="inline-flex items-center gap-2">
                                <AlignLeft className="h-4 w-4" />
                                Aligner à gauche
                            </span>
                        </SelectItem>
                        <SelectItem value="center">
                            <span className="inline-flex items-center gap-2">
                                <AlignCenter className="h-4 w-4" />
                                Centrer
                            </span>
                        </SelectItem>
                        <SelectItem value="right">
                            <span className="inline-flex items-center gap-2">
                                <AlignRight className="h-4 w-4" />
                                Aligner à droite
                            </span>
                        </SelectItem>
                        <SelectItem value="justify">
                            <span className="inline-flex items-center gap-2">
                                <AlignJustify className="h-4 w-4" />
                                Justifier
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <ToolbarButton
                    label="Gras"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Italique"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Souligné"
                    active={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <Underline className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Séparateur"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Effacer le formatage"
                    onClick={clearFormatting}
                >
                    <Eraser className="h-4 w-4" />
                </ToolbarButton>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Select value={selectedHeadingTool || undefined} onValueChange={applyHeadingTool}>
                    <SelectTrigger className="h-8 w-[56px] bg-card hover:bg-card data-[state=open]:bg-card" aria-label="Titres">
                        <SelectValue
                            placeholder={
                                <span className="inline-flex items-center justify-center w-full">
                                    <Heading1 className="h-4 w-4" />
                                    <span className="sr-only">Titres</span>
                                </span>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paragraph">
                            <span className="text-sm">Paragraphe</span>
                        </SelectItem>
                        <SelectItem value="h1">
                            <Heading1 className="h-4 w-4" />
                        </SelectItem>
                        <SelectItem value="h2">
                            <Heading2 className="h-4 w-4" />
                        </SelectItem>
                        <SelectItem value="h3">
                            <Heading3 className="h-4 w-4" />
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedListTool || undefined} onValueChange={applyListTool}>
                    <SelectTrigger className="h-8 w-[130px] bg-card hover:bg-card data-[state=open]:bg-card" aria-label="Listes">
                        <SelectValue placeholder="Listes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">
                            <span className="inline-flex items-center gap-2 text-sm">
                                Aucune liste
                            </span>
                        </SelectItem>
                        <SelectItem value="bullet">
                            <span className="inline-flex items-center gap-2">
                                <List className="h-4 w-4" />
                                Puces
                            </span>
                        </SelectItem>
                        <SelectItem value="ordered">
                            <span className="inline-flex items-center gap-2">
                                <ListOrdered className="h-4 w-4" />
                                Numérotée
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <ToolbarButton
                    label="Ajouter ou modifier un lien"
                    active={editor.isActive("link")}
                    onClick={addLink}
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Annuler"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Rétablir"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>

                <div className="ml-auto hidden items-center gap-3 pl-3 text-xs text-muted-foreground xl:flex">
                    <span>{wordCount} mots</span>
                </div>
            </div>

            <EditorContent editor={editor} />

            <div className="border-t border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <span>{characterCount} caractères</span>
            </div>
        </div>
    );
}