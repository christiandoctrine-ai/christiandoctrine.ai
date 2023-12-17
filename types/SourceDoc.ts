interface SourceDoc {
  pageContent: string;
  metadata: {
    source: string;
    // Added page number
    page_number: string;
    author: string;
    year: string;
    title: string;
    publisher: string;
    page: string;
  };
}

export default SourceDoc;
