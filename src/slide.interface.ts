
export interface Slide {
  type: 'title' | 'question' | 'answer' | 'image' | 'mindmap' | 'final' | 'table';
  title?: string;
  subtitle?: string;
  content?: string | string[];
  imageSrc?: string;
  mindmap?: MindmapNode;
  tableHeaders?: string[];
  tableRows?: string[][];
}

export interface MindmapNode {
  center: string;
  branches: { title: string; text: string }[];
}
