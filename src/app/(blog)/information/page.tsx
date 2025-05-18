function formatPhoneNumber(phone: string) {
  // Bersihkan input: hanya angka, tapi pertahankan awalan +
  let cleaned = phone.replace(/[^\d]/g, '');

  // Pastikan diawali +62
  if (cleaned.startsWith('62')) {
    cleaned = '+62' + cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('+62')) {
    cleaned = '+62' + cleaned;
  }

  // Ambil nomor setelah kode negara
  const number = cleaned.slice(3);

  // Bagi menjadi bagian-bagian: 3 digit pertama, lalu 4 digit, lalu sisanya
  const first = number.slice(0, 3);
  const second = number.slice(3, 7);
  const third = number.slice(7);

  let result = '+62';
  if (first) result += ' ' + first;
  if (second) result += '-' + second;
  if (third) result += '-' + third;

  return result;
}

export default function ContactPage() {
  const contactData = [
    {
      title: 'Tamu Putra',
      contacts: [{ number: '6285903700078' }, { number: '628813891397' }]
    },
    {
      title: 'Tamu Putri',
      contacts: [{ number: '62882003334533' }]
    },
    {
      title: 'Konsumsi Putra',
      contacts: [{ number: '6289519781520' }, { number: '6285601305515' }]
    },
    {
      title: 'Konsumsi Putri',
      contacts: [{ number: '6282257718307' }]
    },
    {
      title: 'Kesehatan Putra',
      contacts: [{ number: '62895403595436' }]
    },
    {
      title: 'Kesehatan Putri',
      contacts: [{ number: '6285894288426' }]
    },
    {
      title: 'Humas',
      contacts: [{ number: '6282291424341' }]
    },
    {
      title: 'Mobil Pelayanan Tamu',
      contacts: [{ number: '62882007534377' }]
    },
    {
      title: 'reservasi futsal',
      contacts: [{ number: '6285647885598' }]
    },
    {
      title: 'Pj Lomba Dakwah Kontemporer',
      contacts: [{ number: '6285725734277' }, { number: '6281327274558' }]
    },
    {
      title: 'Pj Lomba MQK',
      contacts: [{ number: '6281227225453' }]
    },
    {
      title: 'Pj Lomba Olimpiade Amtsilati',
      contacts: [{ number: '6281215950244' }, { number: '62882008084115' }]
    }
  ];

  return (
    <div className='bg-primary min-h-screen px-4 py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold text-green-200 md:text-4xl'>
        Kontak Panitia
      </h1>
      <div className='mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {contactData.map((section, index) => (
          <div
            key={index}
            className='rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl'
          >
            <h2 className='text-primary mb-4 border-b-2 border-green-200 pb-2 text-xl font-semibold'>
              {section.title}
            </h2>
            {section.contacts.map((contact, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${contact.number}?text=${encodeURIComponent(
                  "Assalamu'alaikum Wr.Wb"
                )}`}
                target='_blank'
                rel='noopener noreferrer'
                className='group mb-3 flex items-center gap-2 text-green-700 hover:text-green-900'
              >
                <span className='inline-block rounded-full bg-green-600 p-2 text-white transition-colors group-hover:bg-green-700'>
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                  </svg>
                </span>
                <span className='text-lg'>
                  {formatPhoneNumber(contact.number)}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
