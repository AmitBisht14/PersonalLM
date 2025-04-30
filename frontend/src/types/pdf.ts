export interface Section {
  title: string;
  page_number: number;
}

export interface Chapter {
  title: string;
  start_page: number;
  end_page: number;
  length: number;
  sections: Section[];
}

export interface PDFStructureData {
  filename: string;
  total_pages: number;
  chapters: Chapter[];
}

export interface PDFPageContent {
  page_number: number;
  text: string;
}

export interface PDFContent {
  filename: string;
  start_page: number;
  end_page: number;
  total_pages: number;
  pages: PDFPageContent[];
}
