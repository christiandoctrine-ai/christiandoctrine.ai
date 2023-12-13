interface SourceDoc {
  pageContent: string;
  metadata: {
    source: string;
    // Added page number
    page_number: string;
  };
}

export default SourceDoc;
