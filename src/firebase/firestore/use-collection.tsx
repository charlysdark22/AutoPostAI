'use client';
import { useEffect, useState, useRef } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface CollectionData<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T>(q: Query | null): CollectionData<T> {
  const [collectionData, setCollectionData] = useState<CollectionData<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const queryRef = useRef(q);

  useEffect(() => {
    // Deep comparison for query objects
    if (JSON.stringify(queryRef.current) !== JSON.stringify(q)) {
      queryRef.current = q;
    }
  }, [q]);

  useEffect(() => {
    if (!queryRef.current) {
      setCollectionData({ data: null, loading: false, error: null });
      return;
    }

    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: T[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as unknown as T));
        setCollectionData({ data, loading: false, error: null });
      },
      (error: FirestoreError) => {
        console.error('Error fetching collection:', error);
        setCollectionData({ data: null, loading: false, error });
      }
    );

    return () => unsubscribe();
  }, [queryRef.current]);

  return collectionData;
}
