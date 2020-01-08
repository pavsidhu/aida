import { useState, useEffect } from 'react'
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'

function resolveDocRef(path: string): FirebaseFirestoreTypes.DocumentReference {
  const items = path.split('/')

  return items.reduce(
    (ref, item, index) =>
      index === items.length - 1 ? ref.doc(item) : ref.collection(item),
    firestore() as any
  )
}

export default function useFirestore(
  path: string,
  resolvers: string[],
  deps?: React.DependencyList
) {
  const [result, setResult] = useState()

  useEffect(() => {
    const docRef = resolveDocRef(path)

    

    docRef.onSnapshot(snapshot => {
      const data = snapshot.data()

      if (!data) throw Error(`Document not found`)

      for (const resolver of resolvers) {
        if (!data[resolver]) throw Error(`Field not found: [resolver]`)

        if (data[resolver] instanceof String) {
          const field = data[
            resolver
          ] as FirebaseFirestoreTypes.DocumentReference

          field.
        }

        if (data[resolver] instanceof Array) {
        }
      }

      setResult({ ...data, id: snapshot.id })
    })
  }, deps)

  return result
}

// Example usage:
// const match = useFirestore(
//   `matches/${props.id}`,
//   ['users', 'users.photo'],
//   [props.id]
// )