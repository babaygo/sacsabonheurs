"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import HardBreak from "@tiptap/extension-hard-break";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Undo,
    Redo,
    Underline,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
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

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "mb-3"
                    }
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline",
                },
            }),
            TextStyle,
            FontSize,
            Color,
            HardBreak
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
    const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
    const currentColor = editor.getAttributes("textStyle").color || "var(--rte-color-ink)";

    const colorOptions = [
        { label: "Encre", value: "var(--rte-color-ink)" },
        { label: "Primaire", value: "var(--rte-color-primary)" },
        { label: "Accent", value: "var(--rte-color-accent)" },
        { label: "Muted", value: "var(--rte-color-muted)" },
        { label: "Creme", value: "var(--rte-color-cream)" },
        { label: "Alerte", value: "var(--rte-color-destructive)" },
    ];

    const setFontSize = (size: string) => {
        editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    };

    const setTextColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
    };

    const addLink = () => {
        const url = window.prompt("URL du lien:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
                <Select value={currentFontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue placeholder="Taille" />
                    </SelectTrigger>
                    <SelectContent>
                        {fontSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={currentColor} onValueChange={setTextColor}>
                    <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue placeholder="Couleur" />
                    </SelectTrigger>
                    <SelectContent>
                        {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    {color.label}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-gray-200" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-gray-200" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "bg-gray-200" : ""}
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor.isActive("link") ? "bg-gray-200" : ""}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}