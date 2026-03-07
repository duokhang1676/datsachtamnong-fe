"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Figure } from './FigureExtension';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { useCallback, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "Nhập nội dung bài viết..." }: RichTextEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageData, setImageData] = useState({ src: '', caption: '' });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Figure,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  const addImage = useCallback(() => {
    setShowImageModal(true);
  }, []);

  const addImageFromFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          setImageData({ src: url, caption: '' });
          setShowImageModal(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const handleImageInsert = () => {
    if (imageData.src && editor) {
      if (imageData.caption) {
        // Use Figure with caption
        editor.chain().focus().setFigure({
          src: imageData.src,
          caption: imageData.caption,
        }).run();
      } else {
        // Use regular Image without caption
        editor.chain().focus().setImage({ src: imageData.src }).run();
      }
      setShowImageModal(false);
      setImageData({ src: '', caption: '' });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-800"
          title="Hoàn tác"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-800"
          title="Làm lại"
        >
          <Redo size={18} />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="In đậm"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="In nghiêng"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Gạch dưới"
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Danh sách"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Danh sách có số"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Text alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="Căn trái"
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="Căn giữa"
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 hover:bg-gray-200 rounded text-gray-800 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="Căn phải"
        >
          <AlignRight size={18} />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Image */}
        <button
          type="button"
          onClick={addImageFromFile}
          className="p-2 hover:bg-gray-200 rounded text-gray-800"
          title="Chèn ảnh từ máy tính"
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 hover:bg-gray-200 rounded text-xs font-medium text-gray-800"
          title="Chèn ảnh từ URL"
        >
          URL
        </button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="bg-white" />
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Chèn ảnh</h3>
            
            {imageData.src && (
              <div className="mb-4">
                <img 
                  src={imageData.src} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded border"
                />
              </div>
            )}

            {!imageData.src && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL ảnh
                </label>
                <input
                  type="text"
                  value={imageData.src}
                  onChange={(e) => setImageData({ ...imageData, src: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề ảnh (tùy chọn)
              </label>
              <input
                type="text"
                value={imageData.caption}
                onChange={(e) => setImageData({ ...imageData, caption: e.target.value })}
                placeholder="Mô tả về ảnh này..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39b54a]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImageInsert}
                disabled={!imageData.src}
                className="flex-1 bg-[#39b54a] text-white px-4 py-2 rounded-lg hover:bg-[#2d8f3a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Chèn ảnh
              </button>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageData({ src: '', caption: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
