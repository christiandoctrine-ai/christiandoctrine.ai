import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useNamespaces() {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('namespace');

  return { namespaces, selectedNamespace, setSelectedNamespace };
}
