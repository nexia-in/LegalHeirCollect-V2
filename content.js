/* EDITABLE FORM CONTENT: Nexia Virtual Desk Legal Heirship Portal (Updated V4) */
const NEXIA_CONTENT = {
  whatsapp: '919961850698',
  whatsappUrl: 'https://wa.me/919961850698',
  brand: 'Nexia Virtual Desk',
  tagline: 'Your Trusted Digital Service Partner Since 2009 | Olarikkara, Thrissur',
  services: [
    {
      title: 'Online Applications / ഓൺലൈൻ അപേക്ഷകൾ',
      desc: 'ഇനി ഓൺലൈൻ അപേക്ഷകൾക്കായി നേരിട്ട് വരേണ്ടതില്ല! വില്ലേജ്, പഞ്ചായത്ത്, റവന്യൂ, മറ്റ് സർക്കാർ സേവനങ്ങൾ വീട്ടിലിരുന്ന് WhatsApp വഴി പൂർത്തിയാക്കാം.'
    },
    {
      title: 'Resume, Biodata & CV / റെസ്യൂമെ & ബയോഡാറ്റ',
      desc: 'ജോലി ആവശ്യങ്ങൾക്കായി ആകർഷകമായ പ്രൊഫഷണൽ Resume, Biodata, CV എന്നിവ മിതമായ നിരക്കിൽ തയ്യാറാക്കി നൽകുന്നു.'
    },
    {
      title: 'Vehicle Insurance & More / ഇൻഷുറൻസ് സേവനങ്ങൾ',
      desc: 'മോട്ടോർ വാഹന ഇൻഷുറൻസ് പോളിസികൾ, പാൻ കാർഡ്, പാസ്പോർട്ട്, മറ്റ് ഡിജിറ്റൽ സേവനങ്ങൾ എന്നിവ വേഗത്തിൽ ലഭ്യമാക്കുന്നു.'
    }
  ],
  steps: [
    {
      key: 'applicant',
      title: 'Applicant Details / അപേക്ഷകന്റെ വിവരങ്ങൾ',
      file: 'Nexia_Applicant_Data.nxd',
      fields: [
        { id: 'secApplicantPersonal', type: 'sectionHeader', label: '1A. അപേക്ഷകന്റെ വ്യക്തിഗത വിവരങ്ങൾ (Applicant Personal Details)' },
        { id: 'applicantName', label: 'Applicant Full Name / അപേക്ഷകന്റെ പൂർണ്ണ പേര്', type: 'text', required: true },
        { id: 'applicantGender', label: 'Gender / ലിംഗം', type: 'select', required: true, options: ['Male / പുരുഷൻ', 'Female / സ്ത്രീ', 'Other / മറ്റുള്ളവ'] },
        { id: 'applicantDob', label: 'Date of Birth / ജനനത്തീയതി', type: 'dateCombo', required: true, ageTarget: 'applicantAge' },
        { id: 'applicantAge', label: 'Age / പ്രായം', type: 'readonly' },
        {
          id: 'applicantGuardianName',
          typeId: 'applicantGuardianType',
          label: 'Father / Mother / Husband / Wife Name / അച്ഛൻ / അമ്മ / ഭർത്താവ് / ഭാര്യയുടെ പേര്',
          type: 'guardianCombo',
          required: true,
          wide: true
        },
        { id: 'applicantHouseName', label: 'House Name / വീട്ടുപേര്', type: 'text', required: true },
        { id: 'applicantDesam', label: 'Desam / Place / ദേശം (സ്ഥലം)', type: 'text', required: true },
        { id: 'applicantVillage', label: 'Village / വില്ലേജ്', type: 'text', required: true, warning: 'നിങ്ങൾ നൽകുന്ന ഈ വില്ലേജിലേക്കായിരിക്കും അപേക്ഷ സമർപ്പിക്കപ്പെടുക. വില്ലേജിന്റെ പേര് ശരിയാണെന്ന് ഉറപ്പാക്കുക.' },
        { id: 'applicantTaluk', label: 'Taluk / താലൂക്ക്', type: 'text', required: true },
        { id: 'applicantDistrict', label: 'District / ജില്ല', type: 'text', required: true, defaultValue: 'തൃശ്ശൂർ' },
        { id: 'applicantPostOffice', label: 'Post Office / പോസ്റ്റ് ഓഫീസ്', type: 'text' },
        { id: 'applicantPin', label: 'PIN Code / പിൻകോഡ്', type: 'digits', maxLength: 6 },
        { id: 'applicantAddress', label: 'Full Communication Address / പൂർണ്ണ വിലാസം', type: 'textarea', required: true },
        { id: 'applicantMobile', label: 'Mobile Number / മൊബൈൽ നമ്പർ', type: 'tel', required: true, minLength: 10, maxLength: 10 },
        { id: 'applicantAadhaar', label: 'Aadhaar Number / ആധാർ നമ്പർ', type: 'digits', required: true, minLength: 12, maxLength: 12 },
        { id: 'rationCard', label: 'Ration Card Number / റേഷൻ കാർഡ് നമ്പർ', type: 'text' },
        { id: 'voterId', label: 'Election ID Number / ഇലക്ഷൻ ഐഡി നമ്പർ', type: 'text' },
        { id: 'certificatePurpose', label: 'Purpose / Before Whom to Produce / എവിടെ ഹാജരാക്കുന്നതിനാണ് സർട്ടിഫിക്കറ്റ്?', type: 'text', required: true, placeholder: 'ഉദാ: ബാങ്ക് / ഇൻഷുറൻസ് / കെ.എസ്.ഇ.ബി / വില്ലേജ് ഓഫീസ്' },

        { id: 'secDeceasedIntro', type: 'sectionHeader', label: '1B. മരണപ്പെട്ട വ്യക്തിയുടെ പ്രാഥമിക വിവരങ്ങൾ (അടുത്ത ഘട്ടത്തിലേക്ക് ഓട്ടോമാറ്റിക് ആയി എടുക്കുന്നതാണ്)' },
        { id: 'deceasedNamePreliminary', label: 'Deceased Person Full Name / മരണപ്പെട്ട വ്യക്തിയുടെ പൂർണ്ണ പേര്', type: 'text', required: true },
        {
          id: 'applicantRelationToDeceased',
          label: 'Deceased Person is my / മരണപ്പെട്ട വ്യക്തി അപേക്ഷകന്റെ ആരാണ്?',
          type: 'select',
          required: true,
          options: [
            'അച്ഛൻ / Father',
            'അമ്മ / Mother',
            'ഭർത്താവ് / Husband',
            'ഭാര്യ / Wife',
            'മകൻ / Son',
            'മകൾ / Daughter',
            'സഹോദരൻ / Brother',
            'സഹോദരി / Sister',
            'മുത്തച്ഛൻ / Grandfather',
            'മുത്തശ്ശി / Grandmother',
            'അമ്മായിയച്ഛൻ / Father-in-law',
            'അമ്മായിയമ്മ / Mother-in-law',
            'Other / മറ്റുള്ളവ'
          ]
        },
        { id: 'deceasedDeathDatePreliminary', label: 'Date of Death / മരണത്തീയതി', type: 'dateCombo', required: true }
      ]
    },
    {
      key: 'deceased',
      title: 'Deceased Person Details / മരണപ്പെട്ട വ്യക്തിയുടെ വിവരങ്ങൾ',
      file: 'Nexia_Deceased_Data.nxd',
      fields: [
        { id: 'deceasedName', label: 'Deceased Full Name / മരണപ്പെട്ട വ്യക്തിയുടെ പൂർണ്ണ പേര്', type: 'text', required: true },
        { id: 'deceasedGender', label: 'Gender / ലിംഗം', type: 'select', required: true, options: ['Male / പുരുഷൻ', 'Female / സ്ത്രീ', 'Other / മറ്റുള്ളവ'] },
        { id: 'deceasedDob', label: 'Date of Birth / ജനനത്തീയതി (അറിയാമെങ്കിൽ നൽകുക)', type: 'dateCombo', ageTarget: 'deceasedAge' },
        { id: 'deceasedDeathDate', label: 'Date of Death / മരണത്തീയതി', type: 'dateCombo', required: true },
        { id: 'deceasedAge', label: 'Age at Death / മരണസമയത്തെ പ്രായം (തീയതി നൽകുമ്പോൾ തനിയെ വരും, അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യാം)', type: 'text' },
        {
          id: 'deceasedGuardianName',
          typeId: 'deceasedGuardianType',
          label: 'Deceased Father / Mother / Husband / Wife Name / പരേതന്റെ അച്ഛൻ / അമ്മ / ഭർത്താവ് / ഭാര്യയുടെ പേര്',
          type: 'guardianCombo',
          required: true,
          wide: true
        },
        { id: 'deceasedHouseName', label: 'House Name / വീട്ടുപേര്', type: 'text', required: true },
        { id: 'deceasedDeathPlace', label: 'Place of Death / മരണസ്ഥലം', type: 'text', required: true },
        { id: 'deathCertificateNo', label: 'Death Certificate Number / മരണ സർട്ടിഫിക്കറ്റ് നമ്പർ', type: 'text' },
        { id: 'deceasedAddress', label: 'Full Address / പൂർണ്ണ വിലാസം', type: 'textarea', required: true },
        { id: 'deceasedVillage', label: 'Village / വില്ലേജ്', type: 'text', required: true, warning: 'മരണപ്പെട്ട വ്യക്തിയുടെ സ്ഥിരതാമസ വില്ലേജ് കൃത്യമായി രേഖപ്പെടുത്തുക.' },
        { id: 'deceasedTaluk', label: 'Taluk / താലൂക്ക്', type: 'text', required: true },
        { id: 'deceasedDistrict', label: 'District / ജില്ല', type: 'text', required: true, defaultValue: 'തൃശ്ശൂർ' }
      ]
    },
    {
      key: 'heirs',
      title: 'Legal Heirs Details / അവകാശികളുടെ വിവരങ്ങൾ',
      file: 'Nexia_Legal_Heirs.nxd',
      fields: [],
      repeat: 'heirs'
    },
    {
      key: 'witnesses',
      title: 'Witness Details / സാക്ഷികളുടെ വിവരങ്ങൾ',
      file: 'Nexia_Witness_Data.nxd',
      fields: [
        { id: 'secWitness1', type: 'sectionHeader', label: '4A. ഒന്നാം സാക്ഷിയുടെ വിവരങ്ങൾ (Witness 1 Details)' },
        { id: 'witness1Name', label: 'Witness 1 Full Name / ഒന്നാം സാക്ഷിയുടെ പൂർണ്ണ പേര്', type: 'text', required: true },
        { id: 'witness1Gender', label: 'Witness 1 Gender / ലിംഗം', type: 'select', required: true, options: ['Male / പുരുഷൻ', 'Female / സ്ത്രീ', 'Other / മറ്റുള്ളവ'] },
        { id: 'witness1Age', label: 'Witness 1 Age / ഒന്നാം സാക്ഷിയുടെ വയസ്സ്', type: 'digits', required: true, maxLength: 3 },
        {
          id: 'witness1GuardianName',
          typeId: 'witness1GuardianType',
          label: 'Witness 1 Father / Mother / Husband / Wife Name / ഒന്നാം സാക്ഷിയുടെ അച്ഛൻ / അമ്മ / ഭർത്താവ് / ഭാര്യയുടെ പേര്',
          type: 'guardianCombo',
          required: true,
          wide: true
        },
        { id: 'witness1HouseName', label: 'Witness 1 House Name / ഒന്നാം സാക്ഷിയുടെ വീട്ടുപേര്', type: 'text', required: true },
        { id: 'witness1Desam', label: 'Witness 1 Desam / Place / ദേശം (സ്ഥലം)', type: 'text', required: true },
        { id: 'witness1Village', label: 'Witness 1 Village / വില്ലേജ്', type: 'text', required: true },
        { id: 'witness1YearsResiding', label: 'Years Residing / എത്ര വർഷമായി സ്ഥിരതാമസമാണ്?', type: 'digits', required: true, maxLength: 3, defaultValue: '20' },
        { id: 'witness1Aadhaar', label: 'Witness 1 Aadhaar Number / ആധാർ നമ്പർ', type: 'digits', required: true, minLength: 12, maxLength: 12 },
        { id: 'witness1Mobile', label: 'Witness 1 Mobile Number / മൊബൈൽ നമ്പർ', type: 'tel', required: true, minLength: 10, maxLength: 10 },
        { id: 'witness1Address', label: 'Witness 1 Full Address / പൂർണ്ണ വിലാസം', type: 'textarea', required: true },

        { id: 'secWitness2', type: 'sectionHeader', label: '4B. രണ്ടാം സാക്ഷിയുടെ വിവരങ്ങൾ (Witness 2 Details)' },
        { id: 'witness2Name', label: 'Witness 2 Full Name / രണ്ടാം സാക്ഷിയുടെ പൂർണ്ണ പേര്', type: 'text', required: true },
        { id: 'witness2Gender', label: 'Witness 2 Gender / ലിംഗം', type: 'select', required: true, options: ['Male / പുരുഷൻ', 'Female / സ്ത്രീ', 'Other / മറ്റുള്ളവ'] },
        { id: 'witness2Age', label: 'Witness 2 Age / രണ്ടാം സാക്ഷിയുടെ വയസ്സ്', type: 'digits', required: true, maxLength: 3 },
        {
          id: 'witness2GuardianName',
          typeId: 'witness2GuardianType',
          label: 'Witness 2 Father / Mother / Husband / Wife Name / രണ്ടാം സാക്ഷിയുടെ അച്ഛൻ / അമ്മ / ഭർത്താവ് / ഭാര്യയുടെ പേര്',
          type: 'guardianCombo',
          required: true,
          wide: true
        },
        { id: 'witness2HouseName', label: 'Witness 2 House Name / രണ്ടാം സാക്ഷിയുടെ വീട്ടുപേര്', type: 'text', required: true },
        { id: 'witness2Desam', label: 'Witness 2 Desam / Place / ദേശം (സ്ഥലം)', type: 'text', required: true },
        { id: 'witness2Village', label: 'Witness 2 Village / വില്ലേജ്', type: 'text', required: true },
        { id: 'witness2YearsResiding', label: 'Years Residing / എത്ര വർഷമായി സ്ഥിരതാമസമാണ്?', type: 'digits', required: true, maxLength: 3, defaultValue: '20' },
        { id: 'witness2Aadhaar', label: 'Witness 2 Aadhaar Number / ആധാർ നമ്പർ', type: 'digits', required: true, minLength: 12, maxLength: 12 },
        { id: 'witness2Mobile', label: 'Witness 2 Mobile Number / മൊബൈൽ നമ്പർ', type: 'tel', required: true, minLength: 10, maxLength: 10 },
        { id: 'witness2Address', label: 'Witness 2 Full Address / പൂർണ്ണ വിലാസം', type: 'textarea', required: true }
      ]
    }
  ],
  documents: [
    'Applicant Aadhaar Card / അപേക്ഷകന്റെ ആധാർ കാർഡ്',
    'Ration Card / റേഷൻ കാർഡ്',
    'Death Certificate / മരണ സർട്ടിഫിക്കറ്റ്',
    'Legal Heirs Aadhaar Copies / അവകാശികളുടെ ആധാർ പകർപ്പുകൾ',
    'Witness Aadhaar Copies (2 Persons) / രണ്ട് സാക്ഷികളുടെ ആധാർ പകർപ്പുകൾ',
    'Land Tax Receipt / ഭൂനികുതി രസീത്'
  ]
};
