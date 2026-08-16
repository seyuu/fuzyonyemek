import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code,
  Link as LinkIcon, Image as ImageIcon,
  Heading1, Heading2, Heading3,
  Highlighter, Undo, Redo, Minus,
} from 'lucide-react';
import './TipTapEditor.css';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ content, onChange, placeholder = 'Yazınıza başlayın...' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
      Image.configure({ HTMLAttributes: { class: 'editor-image' } }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Görsel URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="tiptap-wrapper">
      {/* ─── Toolbar ─── */}
      <div className="tiptap-toolbar">
        <div className="toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''} title="Başlık 1"><Heading1 size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''} title="Başlık 2"><Heading2 size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''} title="Başlık 3"><Heading3 size={18} /></button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''} title="Kalın"><Bold size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''} title="İtalik"><Italic size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''} title="Altı Çizili"><UnderlineIcon size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''} title="Üstü Çizili"><Strikethrough size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'active' : ''} title="Vurgula"><Highlighter size={18} /></button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''} title="Sola Hizala"><AlignLeft size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''} title="Ortala"><AlignCenter size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''} title="Sağa Hizala"><AlignRight size={18} /></button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''} title="Madde İşareti"><List size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''} title="Numaralı Liste"><ListOrdered size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'active' : ''} title="Alıntı"><Quote size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'active' : ''} title="Kod Bloğu"><Code size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay Çizgi"><Minus size={18} /></button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={addLink} className={editor.isActive('link') ? 'active' : ''} title="Link Ekle"><LinkIcon size={18} /></button>
          <button type="button" onClick={addImage} title="Görsel Ekle"><ImageIcon size={18} /></button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri Al"><Undo size={18} /></button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="İleri Al"><Redo size={18} /></button>
        </div>
      </div>

      {/* ─── Editor Content ─── */}
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
}
