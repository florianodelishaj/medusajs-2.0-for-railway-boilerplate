import { useState, useEffect, useRef } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk.js";
import {
  useEditor,
  EditorContent,
  Editor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

type ProductWidgetProps = {
  data: {
    id: string;
    metadata?: Record<string, any> | null;
  };
};

type MenuBarProps = {
  editor: Editor;
};

const ColorPicker = ({ editor }: { editor: Editor }) => {
  const [colorInput, setColorInput] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setColorInput(color);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInput(value);

    // Applica se è un formato valido
    if (
      value.match(/^#[0-9A-Fa-f]{3}$/) || // #fff
      value.match(/^#[0-9A-Fa-f]{6}$/) || // #ff5733
      value.match(/^#[0-9A-Fa-f]{8}$/) || // #ff5733ff (con alpha)
      value.match(/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/) || // rgb(255, 0, 0)
      value.match(/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/) // rgba(255, 0, 0, 0.5)
    ) {
      applyColor(value);
    }
  };

  const presetColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
  ];

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span
          className="inline-block w-4 h-4 rounded border border-gray-400"
          style={{ backgroundColor: colorInput }}
        />
      </Button>

      {showPicker && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-[#1c1c1f] border border-[#404042] rounded-lg shadow-lg p-4 min-w-[240px]">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Seleziona colore
            </label>
            <input
              type="color"
              value={colorInput}
              onChange={(e) => applyColor(e.target.value)}
              className="w-full h-10 rounded border border-[#404042] bg-transparent cursor-pointer"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Oppure inserisci codice
            </label>
            <input
              type="text"
              value={colorInput}
              onChange={handleTextInput}
              placeholder="#ff5733 o rgb(255, 87, 51)"
              className="w-full px-3 py-2 text-sm bg-[#27272a] border border-[#404042] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formati: #fff, #ff5733, rgb(255, 87, 51), rgba(255, 87, 51, 0.5)
            </p>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Colori rapidi
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => applyColor(color)}
                  className="w-8 h-8 rounded border-2 border-transparent hover:border-violet-500 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setColorInput("#000000");
              setShowPicker(false);
            }}
            className="w-full px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#27272a] rounded transition-colors"
          >
            Rimuovi colore
          </button>
        </div>
      )}
    </div>
  );
};

const MenuBar = ({ editor }: MenuBarProps) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,
    }),
  });

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        type="button"
        size="small"
        variant={editorState.isBold ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button"
        size="small"
        variant={editorState.isItalic ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        size="small"
        variant={editorState.isHeading2 ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>
      <Button
        type="button"
        size="small"
        variant={editorState.isHeading3 ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Button>
      <Button
        type="button"
        size="small"
        variant={editorState.isBulletList ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • Lista
      </Button>
      <Button
        type="button"
        size="small"
        variant={editorState.isOrderedList ? "primary" : "secondary"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. Lista
      </Button>
      <ColorPicker editor={editor} />
    </div>
  );
};

const ProductExtendedDescriptionWidget = ({
  data: product,
}: ProductWidgetProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] p-4 border border-[#404042] rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500",
      },
    },
    onUpdate: () => {
      setHasChanges(true);
    },
  });

  // Carica il contenuto salvato quando il prodotto cambia
  useEffect(() => {
    if (editor && product.metadata?.extended_description) {
      editor.commands.setContent(
        product.metadata.extended_description as string
      );
      setHasChanges(false);
    }
  }, [editor, product.id, product.metadata]);

  const { mutate: handleSave, isPending } = useMutation({
    mutationFn: async (html: string) => {
      return await sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          extended_description: html,
        },
      });
    },
    onSuccess: () => {
      toast.success("Descrizione estesa salvata con successo");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] });
    },
    onError: (error: any) => {
      toast.error(`Errore: ${error.message || "Impossibile salvare"}`);
    },
  });

  const onSave = () => {
    if (!editor) return;
    const html = editor.getHTML();
    handleSave(html);
  };

  const onClear = () => {
    if (!editor) return;
    editor.commands.clearContent();
    setHasChanges(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Descrizione Estesa</Heading>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={onClear}
            disabled={isPending}
          >
            Cancella
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            isLoading={isPending}
            disabled={!hasChanges || isPending}
          >
            Salva
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Toolbar */}
        <MenuBar editor={editor} />

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductExtendedDescriptionWidget;
