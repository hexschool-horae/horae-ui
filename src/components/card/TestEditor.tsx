// import dynamic from "next/dynamic";
// import ReactMarkdown from "react-markdown";
// // import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
// // import {dark} from 'react-syntax-highlighter/dist/cjs/styles/prism'
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
// import "react-markdown-editor-lite/lib/index.css";

// const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
//   ssr: false
// });

// export default function TestEditor() {
//   return (
//     <MdEditor
//       style={{ height: "500px" }}
//       renderHTML={(text) => <ReactMarkdown children={text}
//       components={{
//         code({node, inline, className, children, ...props}) {
//           const match = /language-(\w+)/.exec(className || '')
//           return !inline && match ? (
//             <SyntaxHighlighter
//               {...props}
//               children={String(children).replace(/\n$/, '')}
//               style={github}
//               language={match[1]}
//               PreTag="div"
//             />
//           ) : (
//             <code {...props} className={className}>
//               {children}
//             </code>
//           )
//         }
//       }}
//       />}
//     />
//   );
// }
