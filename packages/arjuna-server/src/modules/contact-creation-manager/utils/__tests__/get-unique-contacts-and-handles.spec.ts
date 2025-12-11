import { type Contact } from 'src/modules/contact-creation-manager/types/contact.type';
import { getUniqueContactsAndHandles } from 'src/modules/contact-creation-manager/utils/get-unique-contacts-and-handles.util';

describe('getUniqueContactsAndHandles', () => {
  it('should return empty arrays when contacts is empty', () => {
    const contacts: Contact[] = [];
    const result = getUniqueContactsAndHandles(contacts);

    expect(result.uniqueContacts).toEqual([]);
    expect(result.uniqueHandles).toEqual([]);
  });

  it('should return unique contacts and handles', () => {
    const contacts: Contact[] = [
      { handle: 'john@vedpragya.com', displayName: 'John Doe' },
      { handle: 'john@vedpragya.com', displayName: 'John Doe' },
      { handle: 'jane@vedpragya.com', displayName: 'Jane Smith' },
      { handle: 'jane@vedpragya.com', displayName: 'Jane Smith' },
      { handle: 'jane@vedpragya.com', displayName: 'Jane Smith' },
    ];
    const result = getUniqueContactsAndHandles(contacts);

    expect(result.uniqueContacts).toEqual([
      { handle: 'john@vedpragya.com', displayName: 'John Doe' },
      { handle: 'jane@vedpragya.com', displayName: 'Jane Smith' },
    ]);
    expect(result.uniqueHandles).toEqual([
      'john@vedpragya.com',
      'jane@vedpragya.com',
    ]);
  });

  it('should deduplicate handles when they are in different cases', () => {
    const contacts: Contact[] = [
      { handle: 'john@vedpragya.com', displayName: 'John Doe' },
      { handle: 'John@vedpragya.com', displayName: 'John Doe' },
    ];
    const result = getUniqueContactsAndHandles(contacts);

    expect(result.uniqueContacts).toEqual([
      { handle: 'john@vedpragya.com', displayName: 'John Doe' },
    ]);
    expect(result.uniqueHandles).toEqual(['john@vedpragya.com']);
  });
});
