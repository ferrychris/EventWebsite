import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  return (
    <Editor
      apiKey="rc1g6a4jbgh2gzi4tyhs46enw0y02thncz6eusupqyd70fpk"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
          'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount',
          'emoticons', 'template'
        ],
        toolbar: 'undo redo | styles | bold italic underline strikethrough | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image emoticons | ' +
          'removeformat help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }
          a { color: ${primaryColor}; }
          p { margin: 0 0 1rem 0; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 1rem 0; }
          ul, ol { margin: 0 0 1rem 0; padding-left: 2rem; }
          table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
          th, td { border: 1px solid #e5e7eb; padding: 0.5rem; }
          img { max-width: 100%; height: auto; }
        `,
        style_formats: [
          { title: 'Heading 1', format: 'h1' },
          { title: 'Heading 2', format: 'h2' },
          { title: 'Heading 3', format: 'h3' },
          { title: 'Paragraph', format: 'p' },
          { title: 'Blockquote', format: 'blockquote' },
          {
            title: 'Custom Styles',
            items: [
              { title: 'Button', inline: 'span', classes: 'button' },
              { title: 'Highlight', inline: 'span', classes: 'highlight' }
            ]
          }
        ],
        formats: {
          button: {
            inline: 'span',
            classes: 'button',
            styles: {
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: primaryColor,
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              cursor: 'pointer'
            }
          },
          highlight: {
            inline: 'span',
            classes: 'highlight',
            styles: {
              backgroundColor: `${primaryColor}20`,
              padding: '2px 4px',
              borderRadius: '4px'
            }
          }
        }
      }}
    />
  );
}