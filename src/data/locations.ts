
export const countries = [
    { value: 'Vietnam', label: 'Vietnam' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Cambodia', label: 'Cambodia' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Macao', label: 'Macao' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'Taiwan', label: 'Taiwan' },
];

export const citiesByCountry: { [country: string]: { value: string; label: string }[] } = {
    Vietnam: [
        { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
        { value: 'Hanoi', label: 'Hanoi' },
        { value: 'Ha Long Bay', label: 'Ha Long Bay' },
        { value: 'Danang', label: 'Danang' },
        { value: 'Nha Trang', label: 'Nha Trang' },
        { value: 'Can Tho', label: 'Can Tho' },
        { value: 'Phu Quoc', label: 'Phu Quoc' },
    ],
    Thailand: [
        { value: 'Bangkok', label: 'Bangkok' },
        { value: 'Chiang Mai', label: 'Chiang Mai' },
        { value: 'Pattaya', label: 'Pattaya' },
        { value: 'Phuket', label: 'Phuket' },
        { value: 'Hat Yai', label: 'Hat Yai' },
    ],
    Malaysia: [
        { value: 'Penang', label: 'Penang' },
        { value: 'Kuala Lumpur', label: 'Kuala Lumpur' },
        { value: 'Johor Bahru', label: 'Johor Bahru' },
        { value: 'Kota Kinabalu', label: 'Kota Kinabalu' },
    ],
};
