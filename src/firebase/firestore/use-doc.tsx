'use client';
import { useEffect, useState, useRef } from 'react';
import {
  onSnapshot,
  doc,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';

interface DocData<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T>(ref: DocumentReference | null): DocData<T> {
  const [docData, setDocData] = useState<DocData<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refRef = useRef(ref);

  useEffect(() => {
     if (refRef.current?.path !== ref?.path) {
        refRef.current = ref;
     }
  }, [ref]);

  useEffect(() => {
    if (!refRef.current) {
      setDocData({ data: null, loading: false, error: null });
      return;
    }

    const unsubscribe = onSnapshot(
      refRef.current,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const data = {
            id: snapshot.id,
            ...snapshot.data(),
          } as unknown as T;
          setDocData({ data, loading: false, error: null });
        } else {
          setDocData({ data: null, loading: false, error: null });
        }
      },
      (error: FirestoreError) => {
        console.error('Error fetching document:', error);
        setDocData({ data: null, loading: false, error });
      }
    );

    return () => unsubscribe();
  }, [refRef.current]);

  return docData;
}
