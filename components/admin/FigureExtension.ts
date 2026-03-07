import { Node, mergeAttributes } from '@tiptap/core';

export interface FigureOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: { src: string; alt?: string; caption?: string }) => ReturnType;
    };
  }
}

export const Figure = Node.create<FigureOptions>({
  name: 'figure',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'inline*',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      caption: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption } = HTMLAttributes;
    
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, { class: 'figure-wrapper' }),
      [
        'img',
        {
          src,
          alt: alt || '',
          class: 'figure-image',
        },
      ],
      caption
        ? [
            'figcaption',
            { class: 'figure-caption' },
            caption,
          ]
        : '',
    ];
  },

  addCommands() {
    return {
      setFigure:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
