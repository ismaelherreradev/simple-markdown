type Block = {
  element: 'ul' | 'li' | 'p' | 'h1' | 'h2';
  children: (Block | string)[];
};

const parseMarkdown = (markdown: string): Block[] => {
  // TODO: implement
};

function App() {
  return (
    <div>
      <textarea onChange={(e) => console.log(e.target.value)} rows={5} />
    </div>
  );
}

export default App;
