import type { Metadata } from 'next';
import { CollectionClient } from './CollectionClient';

export const metadata: Metadata = {
    title: 'Colección Completa | Luxe Essence',
    description: 'Explorá toda la colección de fragancias árabes premium — masculinas, femeninas y decants exclusivos. Luxe Essence Tandil.',
};

export default function ColeccionPage() {
    return <CollectionClient />;
}
