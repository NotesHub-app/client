import { removeNoteWithChildren } from '../data';
import * as Immutable from 'immutable';

describe('removeNoteWithChildren', () => {
    test('isOk!', () => {
        const srcData = Immutable.fromJS({
            a1: { id: 'a1', parentId: null },
            a2: { id: 'a2', parentId: 'a1' },
            a3: { id: 'a3', parentId: 'a2' },
            o1: { id: 'o1', parentId: null },
        });

        expect(removeNoteWithChildren(srcData, 'a1')).toEqual(
            Immutable.fromJS({
                o1: { id: 'o1', parentId: null },
            })
        );
    });
});
