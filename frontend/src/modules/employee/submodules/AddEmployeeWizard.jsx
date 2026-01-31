import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaCheck, FaPlus, FaChevronDown, FaSearch, FaTimes } from 'react-icons/fa';

const AddEmployeeWizard = ({
    onCancel,
    onFinish,
    companies,
    departments,
    jobPositions,
    workTypes,
    managers,
    personalData,
    setPersonalData,
    workData,
    setWorkData,
    bankData,
    setBankData,
    handleEmployeeCreate,
    handleCreateWork,
    handleCreateBank,
    handleFileChange,
    currentStep,
    setCurrentStep
}) => {
    const [showBadgeId, setShowBadgeId] = useState(false);

    const stepNames = [
        'Personal & Aadhaar',
        'Education & Professional',
        'Emergency Contact',
        'PAN Details',
        'Passport Details',
        'Driving License',
        'Resume Details',
        'Work Assignment',
        'Bank Information'
    ];

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        background: '#fff',
        fontSize: '0.95rem',
        color: '#1e293b',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '0.5rem'
    };

    const sectionTitleStyle = {
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #f1f5f9'
    };

    const dropzoneStyle = {
        border: '2px dashed #cbd5e1',
        borderRadius: '20px',
        padding: '2rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: '0.3s',
        background: '#f8fafc',
        width: '100%',
        marginBottom: '2rem'
    };

    const nextStep = () => {
        if (currentStep < 7) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 7) {
            handleEmployeeCreate();
        } else if (currentStep === 8) {
            handleCreateWork(new Event('submit'));
        } else if (currentStep === 9) {
            handleCreateBank(new Event('submit'));
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const [searchTerms, setSearchTerms] = useState({ country: '', state: '' });
    const [activeDropdown, setActiveDropdown] = useState(null);

    const SearchableSelect = ({ label, value, options, onChange, placeholder, type, disabled }) => {
        const filteredOptions = (options || []).filter(opt =>
            opt.toLowerCase().includes((searchTerms[type] || '').toLowerCase())
        );

        return (
            <div style={{ position: 'relative' }}>
                <label style={labelStyle}>{label}</label>
                <div
                    onClick={() => !disabled && setActiveDropdown(activeDropdown === type ? null : type)}
                    style={{
                        ...inputStyle,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        background: disabled ? '#f8fafc' : '#fff',
                        borderColor: activeDropdown === type ? 'var(--primary-color)' : '#e2e8f0'
                    }}
                >
                    <span style={{ color: value ? '#1e293b' : '#94a3b8', fontSize: '0.9rem' }}>{value || placeholder}</span>
                    <FaChevronDown size={12} style={{ color: '#64748b', transform: activeDropdown === type ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>

                {activeDropdown === type && (
                    <>
                        <div
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                            onClick={() => setActiveDropdown(null)}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            zIndex: 1000,
                            padding: '12px',
                            border: '1px solid #eef2f6',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <div style={{ position: 'relative', marginBottom: '12px' }}>
                                <FaSearch size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    autoFocus
                                    placeholder={`Search ${label}...`}
                                    value={searchTerms[type]}
                                    onChange={(e) => setSearchTerms({ ...searchTerms, [type]: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && filteredOptions.length > 0) {
                                            onChange(filteredOptions[0]);
                                            setActiveDropdown(null);
                                            setSearchTerms({ ...searchTerms, [type]: '' });
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 36px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        color: '#1e293b'
                                    }}
                                />
                            </div>
                            <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => {
                                                onChange(opt);
                                                setActiveDropdown(null);
                                                setSearchTerms({ ...searchTerms, [type]: '' });
                                            }}
                                            style={{
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                color: value === opt ? 'var(--primary-color)' : '#475569',
                                                background: value === opt ? '#f5f3ff' : 'transparent',
                                                fontWeight: value === opt ? 700 : 500,
                                                transition: '0.2s',
                                                marginBottom: '2px'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (value !== opt) e.target.style.background = '#f8fafc';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (value !== opt) e.target.style.background = 'transparent';
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
                                        No results found
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const countryStateData = {
        "Afghanistan": ["Badakhshan", "Badghis", "Baghlan", "Balkh", "Bamyan", "Daykundi", "Farah", "Faryab", "Ghazni", "Ghor", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar", "Kapisa", "Khost", "Kunar", "Kunduz", "Laghman", "Logar", "Nangarhar", "Nimruz", "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan", "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul"],
        "Albania": ["Berat", "Dibër", "Durrës", "Elbasan", "Fier", "Gjirokastër", "Korçë", "Kukës", "Lezhë", "Shkodër", "Tirana", "Vlorë"],
        "Algeria": ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "MSila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"],
        "Australia": ["New South Wales", "Victoria", "Queensland", "South Australia", "Western Australia", "Tasmania", "Northern Territory", "Australian Capital Territory"],
        "Canada": ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"],
        "India": ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"],
        "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
        "Argentina": ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"],
        "Austria": ["Burgenland", "Carinthia", "Lower Austria", "Upper Austria", "Salzburg", "Styria", "Tyrol", "Vorarlberg", "Vienna"],
        "Bangladesh": ["Barisal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"],
        "Belgium": ["Brussels-Capital", "Flanders", "Wallonia"],
        "Brazil": ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins", "Federal District"],
        "China": ["Anhui", "Fujian", "Gansu", "Guangdong", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hubei", "Hunan", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Qinghai", "Shaanxi", "Shandong", "Shanxi", "Sichuan", "Yunnan", "Zhejiang", "Guangxi", "Inner Mongolia", "Ningxia", "Tibet", "Xinjiang", "Beijing", "Shanghai", "Tianjin", "Chongqing", "Hong Kong", "Macau"],
        "France": ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d’Azur"],
        "Germany": ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
        "Indonesia": ["Aceh", "Bali", "Bangka Belitung Islands", "Banten", "Bengkulu", "Central Java", "Central Kalimantan", "Central Sulawesi", "East Java", "East Kalimantan", "East Nusa Tenggara", "Gorontalo", "Jakarta", "Jambi", "Lampung", "Maluku", "North Kalimantan", "North Maluku", "North Sulawesi", "North Sumatra", "Papua", "Riau", "Riau Islands", "South Kalimantan", "South Sulawesi", "South Sumatra", "Southeast Sulawesi", "West Java", "West Kalimantan", "West Nusa Tenggara", "West Papua", "West Sulawesi", "West Sumatra", "Yogyakarta"],
        "Italy": ["Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia", "Sicily", "Tuscany", "Trentino-Alto Adige", "Umbria", "Veneto"],
        "Japan": ["Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma", "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa", "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Oita", "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"],
        "Malaysia": ["Johor", "Kedah", "Kelantan", "Malacca", "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya"],
        "Mexico": ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico City", "Mexico State", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"],
        "Netherlands": ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"],
        "New Zealand": ["Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke’s Bay", "Manawatū-Whanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast"],
        "Nigeria": ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory"],
        "Pakistan": ["Balochistan", "Gilgit-Baltistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh", "Azad Jammu and Kashmir", "Islamabad Capital Territory"],
        "Philippines": ["Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavinti", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
        "Saudi Arabia": ["Al Bahah", "Al Jawf", "Al Madinah", "Al Qassim", "Asir", "Eastern Province", "Ha'il", "Jazan", "Makkah", "Najran", "Northern Borders", "Riyadh", "Tabuk"],
        "South Africa": ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"],
        "Spain": ["Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castilla-La Mancha", "Castile and León", "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencian Community"],
        "Sweden": ["Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland", "Skåne", "Södermanland", "Stockholm", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland"],
        "Switzerland": ["Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt", "Bern", "Fribourg", "Geneva", "Glarus", "Graubünden", "Jura", "Lucerne", "Neuchâtel", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zurich"],
        "United Arab Emirates": ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
        "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"]
    };

    const countries = Object.keys(countryStateData).sort();

    return (
        <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Top header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <button
                            onClick={onCancel}
                            style={{ background: '#fff', border: 'none', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>New Employee Registration</h2>
                            <p style={{ color: '#64748b', fontSize: '0.925rem', fontWeight: 500 }}>Follow the steps to complete the onboarding process</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Top Horizontal Steps */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        border: '1px solid #eef2f6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        overflowX: 'auto',
                        gap: '1rem'
                    }}>
                        {stepNames.map((name, idx) => {
                            const stepNum = idx + 1;
                            const isActive = currentStep === stepNum;
                            const isCompleted = currentStep > stepNum;

                            return (
                                <div
                                    key={name}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        flex: 1,
                                        minWidth: '80px',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        background: isCompleted ? '#22c55e' : isActive ? 'var(--primary-color)' : '#f1f5f9',
                                        color: isCompleted || isActive ? '#fff' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        transition: '0.3s',
                                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                                    }}>
                                        {isCompleted ? <FaCheck size={12} /> : stepNum}
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: isActive ? 800 : 600,
                                        color: isActive ? '#1e293b' : '#94a3b8',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.025em'
                                    }}>
                                        {name.split(' ')[0]}
                                    </span>

                                    {/* Connecting Line */}
                                    {idx < stepNames.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            left: 'calc(50% + 20px)',
                                            right: 'calc(-50% + 20px)',
                                            height: '2px',
                                            background: isCompleted ? '#22c55e' : '#f1f5f9',
                                            zIndex: -1
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={currentStep}
                        style={{ background: '#fff', borderRadius: '32px', padding: '3.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #eef2f6' }}
                    >
                        <div style={{ minHeight: '500px' }}>
                            {/* Step 1: Personal & Aadhaar Details Combined (Vertical Layout) */}
                            {currentStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                                    {/* Batch ID and Personal Information */}
                                    <section>
                                        <h3 style={sectionTitleStyle}>👤 Personal Information</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                            <div style={{ gridColumn: 'span 3' }}>
                                                <label style={labelStyle}>Batch Id / Badge Id</label>
                                                <input value={personalData.badge_id} onChange={e => setPersonalData({ ...personalData, badge_id: e.target.value })} style={inputStyle} placeholder="e.g. BT-2024-001" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>First Name *</label>
                                                <input required value={personalData.employee_first_name} onChange={e => setPersonalData({ ...personalData, employee_first_name: e.target.value })} style={inputStyle} placeholder="John" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Last Name</label>
                                                <input value={personalData.employee_last_name} onChange={e => setPersonalData({ ...personalData, employee_last_name: e.target.value })} style={inputStyle} placeholder="Doe" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Phone Number *</label>
                                                <input required value={personalData.phone} onChange={e => setPersonalData({ ...personalData, phone: e.target.value })} style={inputStyle} placeholder="+91 98765 43210" />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={labelStyle}>Full Name (as on Aadhaar)</label>
                                                <input value={personalData.aadhaar_full_name} onChange={e => setPersonalData({ ...personalData, aadhaar_full_name: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Aadhaar Number</label>
                                                <input value={personalData.aadhaar_number} onChange={e => setPersonalData({ ...personalData, aadhaar_number: e.target.value })} style={{ ...inputStyle, letterSpacing: '0.1em', fontWeight: 700 }} placeholder="XXXX XXXX XXXX" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Date of Birth</label>
                                                <input type="date" value={personalData.dob} onChange={e => setPersonalData({ ...personalData, dob: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Gender</label>
                                                <select value={personalData.gender} onChange={e => setPersonalData({ ...personalData, gender: e.target.value })} style={inputStyle}>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Address Details */}
                                    <section>
                                        <h3 style={sectionTitleStyle}>🏠 Address Details</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={labelStyle}>House / Flat / Building</label>
                                                <input value={personalData.house_no} onChange={e => setPersonalData({ ...personalData, house_no: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div style={{ gridColumn: 'span 1' }}>
                                                <label style={labelStyle}>Street / Locality / Area</label>
                                                <input value={personalData.street} onChange={e => setPersonalData({ ...personalData, street: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Village / Town / City</label>
                                                <input value={personalData.city} onChange={e => setPersonalData({ ...personalData, city: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>District</label>
                                                <input value={personalData.district} onChange={e => setPersonalData({ ...personalData, district: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>PIN Code</label>
                                                <input value={personalData.zip} onChange={e => setPersonalData({ ...personalData, zip: e.target.value })} style={inputStyle} placeholder="400001" />
                                            </div>
                                            <SearchableSelect
                                                label="Country"
                                                value={personalData.country}
                                                options={countries}
                                                placeholder="Select Country..."
                                                type="country"
                                                onChange={val => setPersonalData({ ...personalData, country: val, state: '' })}
                                            />
                                            <SearchableSelect
                                                label="State"
                                                value={personalData.state}
                                                options={personalData.country ? countryStateData[personalData.country] : []}
                                                placeholder="Select State..."
                                                type="state"
                                                disabled={!personalData.country}
                                                onChange={val => setPersonalData({ ...personalData, state: val })}
                                            />
                                        </div>
                                    </section>

                                    {/* Aadhaar Upload at Bottom */}
                                    <section style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ ...sectionTitleStyle, borderBottom: 'none', marginBottom: '0.5rem' }}>🆔 Aadhaar Document Upload</h3>
                                        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Upload Aadhaar to auto-fill Personal and Address information above.</p>
                                        <label style={{ ...dropzoneStyle, background: '#fff', marginBottom: 0 }}>
                                            <FaPlus size={24} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {personalData.aadhaar_document ? personalData.aadhaar_document.name : 'Click to upload Aadhaar (PDF/JPG)'}
                                            </p>
                                            <input type="file" hidden onChange={e => handleFileChange(e, 'aadhaar_document')} />
                                        </label>
                                    </section>
                                </div>
                            )}

                            {/* Step 2: Education & Professional */}
                            {currentStep === 2 && (
                                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <h3 style={sectionTitleStyle}>🎓 Education & Professional Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Highest Qualification</label>
                                            <input value={personalData.qualification} onChange={e => setPersonalData({ ...personalData, qualification: e.target.value })} style={inputStyle} placeholder="B.Tech, MBA, etc." />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Total Experience (Years)</label>
                                            <input type="number" step="0.5" value={personalData.experience} onChange={e => setPersonalData({ ...personalData, experience: e.target.value })} style={inputStyle} placeholder="5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Emergency Contact */}
                            {currentStep === 3 && (
                                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <h3 style={sectionTitleStyle}>🚨 Emergency Contact Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Contact Name</label>
                                            <input value={personalData.emergency_contact_name} onChange={e => setPersonalData({ ...personalData, emergency_contact_name: e.target.value })} style={inputStyle} placeholder="Guardian / Spouse Name" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Emergency Contact Number</label>
                                            <input value={personalData.emergency_contact} onChange={e => setPersonalData({ ...personalData, emergency_contact: e.target.value })} style={inputStyle} placeholder="+91 98765 00000" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Relationship</label>
                                            <input value={personalData.emergency_contact_relation} onChange={e => setPersonalData({ ...personalData, emergency_contact_relation: e.target.value })} style={inputStyle} placeholder="Father / Mother / Spouse" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: PAN Details */}
                            {currentStep === 4 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h3 style={sectionTitleStyle}>💳 PAN Card Details</h3>
                                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Auto-fills from document.</p>

                                        <label style={dropzoneStyle}>
                                            <FaPlus size={24} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {personalData.pan_document ? personalData.pan_document.name : 'Click to upload PAN Card'}
                                            </p>
                                            <input type="file" hidden onChange={e => handleFileChange(e, 'pan_document')} />
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div>
                                            <label style={labelStyle}>PAN Number</label>
                                            <input value={personalData.pan_number} onChange={e => setPersonalData({ ...personalData, pan_number: e.target.value })} style={{ ...inputStyle, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Full Name (as per PAN)</label>
                                            <input value={personalData.pan_full_name} onChange={e => setPersonalData({ ...personalData, pan_full_name: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Passport Details */}
                            {currentStep === 5 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h3 style={sectionTitleStyle}>🛂 Passport Details</h3>
                                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Auto-fills from document.</p>

                                        <label style={dropzoneStyle}>
                                            <FaPlus size={24} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {personalData.passport_document ? personalData.passport_document.name : 'Click to upload Passport'}
                                            </p>
                                            <input type="file" hidden onChange={e => handleFileChange(e, 'passport_document')} />
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div>
                                            <label style={labelStyle}>Passport Number</label>
                                            <input value={personalData.passport_number} onChange={e => setPersonalData({ ...personalData, passport_number: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Issue Date</label>
                                            <input type="date" value={personalData.passport_issue_date} onChange={e => setPersonalData({ ...personalData, passport_issue_date: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Expiry Date</label>
                                            <input type="date" value={personalData.passport_expiry} onChange={e => setPersonalData({ ...personalData, passport_expiry: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Nationality (Derived)</label>
                                            <input value={personalData.passport_nationality} onChange={e => setPersonalData({ ...personalData, passport_nationality: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Driving License */}
                            {currentStep === 6 && (
                                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <h3 style={sectionTitleStyle}>🚗 Driving License Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <label style={dropzoneStyle}>
                                            <FaPlus size={24} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {personalData.driving_license_document ? personalData.driving_license_document.name : 'Click to upload Driving License'}
                                            </p>
                                            <input type="file" hidden onChange={e => handleFileChange(e, 'driving_license_document')} />
                                        </label>
                                        <div>
                                            <label style={labelStyle}>Driving License Number</label>
                                            <input value={personalData.driving_license} onChange={e => setPersonalData({ ...personalData, driving_license: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 7: Resume Details */}
                            {currentStep === 7 && (
                                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <h3 style={sectionTitleStyle}>📄 Resume Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <label style={dropzoneStyle}>
                                            <FaPlus size={24} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                                                {personalData.resume_document ? personalData.resume_document.name : 'Click to upload Resume'}
                                            </p>
                                            <input type="file" hidden onChange={e => handleFileChange(e, 'resume_document')} />
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={labelStyle}>Qualification (from Resume)</label>
                                                <input value={personalData.qualification} onChange={e => setPersonalData({ ...personalData, qualification: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Experience (from Resume)</label>
                                                <input value={personalData.experience} onChange={e => setPersonalData({ ...personalData, experience: e.target.value })} style={inputStyle} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 8: Work Assignment */}
                            {currentStep === 8 && (
                                <div>
                                    <h3 style={sectionTitleStyle}>💼 Work Assignment</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                                        <div><label style={labelStyle}>Company</label><select required value={workData.company_id} onChange={e => setWorkData({ ...workData, company_id: e.target.value })} style={inputStyle}><option value="">Select...</option>{companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}</select></div>
                                        <div><label style={labelStyle}>Department</label><select required value={workData.department_id} onChange={e => setWorkData({ ...workData, department_id: e.target.value })} style={inputStyle}><option value="">Select...</option>{departments.map(d => <option key={d.id} value={d.id}>{d.department}</option>)}</select></div>
                                        <div><label style={labelStyle}>Job Position</label><select required value={workData.job_position_id} onChange={e => setWorkData({ ...workData, job_position_id: e.target.value })} style={inputStyle}><option value="">Select...</option>{jobPositions.map(p => <option key={p.id} value={p.id}>{p.job_position}</option>)}</select></div>
                                        <div><label style={labelStyle}>Join Date</label><input type="date" value={workData.date_joining} onChange={e => setWorkData({ ...workData, date_joining: e.target.value })} style={inputStyle} /></div>
                                        <div><label style={labelStyle}>Work Type</label><select required value={workData.work_type_id} onChange={e => setWorkData({ ...workData, work_type_id: e.target.value })} style={inputStyle}><option value="">Select...</option>{workTypes.map(w => <option key={w.id} value={w.id}>{w.work_type}</option>)}</select></div>
                                        <div><label style={labelStyle}>Salary (Base)</label><input type="number" value={workData.basic_salary} onChange={e => setWorkData({ ...workData, basic_salary: e.target.value })} style={inputStyle} /></div>
                                    </div>
                                </div>
                            )}

                            {/* Step 9: Bank Details */}
                            {currentStep === 9 && (
                                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <h3 style={sectionTitleStyle}>🏦 Bank Information</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div><label style={labelStyle}>Bank Name</label><input required value={bankData.bank_name} onChange={e => setBankData({ ...bankData, bank_name: e.target.value })} style={inputStyle} /></div>
                                        <div><label style={labelStyle}>Account Number</label><input required value={bankData.account_number} onChange={e => setBankData({ ...bankData, account_number: e.target.value })} style={inputStyle} /></div>
                                        <div><label style={labelStyle}>IFSC Code</label><input value={bankData.ifsc_code} onChange={e => setBankData({ ...bankData, ifsc_code: e.target.value })} style={inputStyle} /></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Controls */}
                        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#fff',
                                    color: '#64748b',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    opacity: currentStep === 1 ? 0.3 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: '0.2s'
                                }}
                            >
                                <FaArrowLeft size={12} /> Previous
                            </button>

                            <button
                                onClick={nextStep}
                                style={{
                                    padding: '0.875rem 2.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: currentStep >= 7 ? '#059669' : 'var(--primary-color)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    transition: '0.2s'
                                }}
                            >
                                {currentStep === 7 ? 'Save & Continue to Work' :
                                    currentStep === 8 ? 'Save & Continue to Bank' :
                                        currentStep === 9 ? 'Finalize Onboarding' :
                                            'Continue'}
                                {currentStep < 7 ? <FaArrowRight size={14} /> : <FaCheck size={14} />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeWizard;
