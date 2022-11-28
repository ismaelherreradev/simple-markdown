import { type ChangeEvent, useState } from 'react';

import './global.css';

type Block = {
  element: 'ul' | 'li' | 'p' | 'h1' | 'h2';
  children: (Block | string)[];
};

const BlockElements = new Map<Block['element'], [RegExp, string]>([
  ['li', [/^(?:\d+\.|[*+-]) .*(?:\r?\n(?!(?:\d+\.|[*+-]) ).*)*/gim, '']],
  ['p', [/([^\n]+\n?)/gim, '$1']],
  ['h1', [/^# (.*$)/gim, '$1']],
  ['h2', [/^## (.*$)/gim, '$1']],
]);

const BlockElement = ({ element: Element, children }: Block) => (
  <Element>{children.join()}</Element>
);

const RenderBlockElement = ({ blocks }: { blocks: Block[] }) => {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.element === 'li') {
          return (
            <ul key={`ul-${index}-renderblockelement-${block.element}`}>
              <BlockElement
                element={block.element}
                children={block.children.map((text) => text.toString().replace(/[^\w\s]/gi, ''))}
              />
            </ul>
          );
        } else {
          return (
            <BlockElement
              key={`${block.element}-${index}-renderblockelement`}
              element={block.element}
              children={block.children}
            />
          );
        }
      })}
    </>
  );
};

const ParseMarkdown = (markdown: string): Block[] => {
  // TODO: implement
  const elements = markdown.split(/\r?\n|\r|\n/g);
  let parseMarkdown: Block[] = [];

  elements.forEach((block): void => {
    BlockElements.forEach(([regx, element], key) => {
      if (regx.test(block) && !block.includes('-') && !block.includes('*')) {
        if (key === 'p') {
          parseMarkdown.push({
            element: key,
            children: /[^\w\s]/gi.test(block) ? [''] : [block.replace(regx, element)],
          });
        } else {
          parseMarkdown.push({
            element: key,
            children: [block.replace(regx, element)],
          });
        }
      }
    });

    if (block.includes('*') || block.includes('-')) {
      parseMarkdown.push({ element: 'li', children: [block] });
    }

    if (block === '') {
      parseMarkdown.push({ element: 'p', children: [block] });
    }
  });

  return parseMarkdown;
};

function App() {
  const [markdown, setMarkdown] = useState<string>(`
# Todo
    - Write test.
    - Refactor the code
    - Reduce rerender
    - Check regex
    
      
## Simple Markdown. Ismael Herrera.
  `);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setMarkdown(event.target.value);
  };

  return (
    <div>
      <div className="grid grid-cols-2 border-b-2 boder-[#e8e8e8]">
        <div className="px-[20px] py-[10px] text-xs">MARDOWN</div>
        <div className="px-[20px] py-[10px] text-xs">RENDER</div>
      </div>
      <div className="grid grid-cols-2">
        <textarea
          className="prose prose-slate min-w-full resize-none p-[30px] rounded leading-5 m-0 text-sm font-medium markdown"
          value={markdown}
          onChange={handleTextareaChange}
        />
        <div className="prose prose-slate min-w-full p-[30px] shadow-lg overflow-y-scroll render">
          <RenderBlockElement blocks={ParseMarkdown(markdown)} />
        </div>
      </div>
    </div>
  );
}

export default App;
