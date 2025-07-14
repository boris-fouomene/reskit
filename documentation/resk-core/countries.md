# 🌍 Countries Management - @resk/core/countries

> **Comprehensive country data and utilities**

## 📖 Overview

The Countries module provides a complete database of world countries with their codes, dial codes, flags, currencies, and other essential information. It includes utilities for country validation, search, and management.

---

## 🚀 Quick Start

### **Basic Country Operations**

```typescript
import { CountriesManager } from '@resk/core/countries';

// Get country by code
const usa = CountriesManager.getCountry('US');
console.log(usa);
/*
{
  code: 'US',
  name: 'United States',
  dialCode: '+1',
  flag: '🇺🇸',
  currency: 'USD',
  phoneNumberExample: '(123) 456-7890'
}
*/

// Get all countries
const allCountries = CountriesManager.getAllCountries();
console.log(`Total countries: ${allCountries.length}`); // 195+

// Search countries
const searchResults = CountriesManager.searchCountries('united');
console.log(searchResults); // [USA, UK, UAE, etc.]

// Get country by dial code
const countryByPhone = CountriesManager.getCountryByDialCode('+33');
console.log(countryByPhone.name); // "France"
```

---

## 🏛️ Country Data Structure

### **ICountry Interface**

```typescript
export interface ICountry {
  code: ICountryCode;              // ISO 3166-1 alpha-2 code
  name: string;                    // English country name
  localName?: string;              // Native language name
  dialCode: string;                // International dialing code
  flag: string;                    // Unicode flag emoji
  currency?: ICurrency;            // Primary currency
  currencies?: ICurrency[];        // All accepted currencies
  phoneNumberExample?: string;     // Example phone number format
  continent?: string;              // Continent name
  region?: string;                 // Geographic region
  subregion?: string;              // Geographic subregion
  capital?: string;                // Capital city
  population?: number;             // Population count
  area?: number;                   // Area in square kilometers
  languages?: string[];            // Official languages
  timezone?: string;               // Primary timezone
  timezones?: string[];            // All timezones
  coordinates?: {                  // Geographic coordinates
    lat: number;
    lng: number;
  };
  borders?: ICountryCode[];        // Bordering countries
  tld?: string[];                  // Top-level domains
  callingCodes?: string[];         // Alternative calling codes
}

// Country code type (ISO 3166-1 alpha-2)
export type ICountryCode = 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | /* ... all 195+ codes */;
```

---

## 🔧 CountriesManager API

### **Country Retrieval**

```typescript
class CountriesManager {
  // Get single country by code
  static getCountry(code: ICountryCode): ICountry | null {
    return this.countries[code] || null;
  }
  
  // Get all countries as array
  static getAllCountries(): ICountry[] {
    return Object.values(this.countries);
  }
  
  // Get countries as object (code -> country)
  static getCountriesObject(): Record<ICountryCode, ICountry> {
    return { ...this.countries };
  }
  
  // Check if country code exists
  static hasCountry(code: string): boolean {
    return code in this.countries;
  }
  
  // Validate country object
  static isValidCountry(country: any): country is ICountry {
    return isObj(country) && isNonNullString(country.code);
  }
}

// Usage examples
const france = CountriesManager.getCountry('FR');
const allCountries = CountriesManager.getAllCountries();
const countryExists = CountriesManager.hasCountry('GB'); // true
const isValid = CountriesManager.isValidCountry(france); // true
```

### **Search and Filtering**

```typescript
class CountriesManager {
  // Search countries by name (case-insensitive)
  static searchCountries(query: string): ICountry[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllCountries().filter(country => 
      country.name.toLowerCase().includes(lowerQuery) ||
      country.localName?.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Filter by continent
  static getCountriesByContinent(continent: string): ICountry[] {
    return this.getAllCountries().filter(country => 
      country.continent?.toLowerCase() === continent.toLowerCase()
    );
  }
  
  // Filter by currency
  static getCountriesByCurrency(currency: string): ICountry[] {
    return this.getAllCountries().filter(country => 
      country.currency === currency ||
      country.currencies?.includes(currency)
    );
  }
  
  // Filter by language
  static getCountriesByLanguage(language: string): ICountry[] {
    return this.getAllCountries().filter(country => 
      country.languages?.some(lang => 
        lang.toLowerCase().includes(language.toLowerCase())
      )
    );
  }
  
  // Get countries by region
  static getCountriesByRegion(region: string): ICountry[] {
    return this.getAllCountries().filter(country => 
      country.region?.toLowerCase() === region.toLowerCase()
    );
  }
}

// Usage examples
const europeanCountries = CountriesManager.getCountriesByContinent('Europe');
const usdCountries = CountriesManager.getCountriesByCurrency('USD');
const englishCountries = CountriesManager.getCountriesByLanguage('English');
const searchResults = CountriesManager.searchCountries('kingdom');
```

### **Phone Number Utilities**

```typescript
class CountriesManager {
  // Get country by dial code
  static getCountryByDialCode(dialCode: string): ICountry | null {
    // Remove + prefix if present
    const cleanCode = dialCode.replace(/^\+/, '');
    
    // Find country with matching dial code
    return this.getAllCountries().find(country => 
      country.dialCode.replace(/^\+/, '') === cleanCode ||
      country.callingCodes?.includes(cleanCode)
    ) || null;
  }
  
  // Get all countries with specific dial code
  static getCountriesByDialCode(dialCode: string): ICountry[] {
    const cleanCode = dialCode.replace(/^\+/, '');
    
    return this.getAllCountries().filter(country => 
      country.dialCode.replace(/^\+/, '') === cleanCode ||
      country.callingCodes?.includes(cleanCode)
    );
  }
  
  // Parse phone number to extract country
  static parsePhoneNumber(phoneNumber: string): {
    country: ICountry | null;
    nationalNumber: string;
    dialCode: string;
  } {
    // Remove non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleaned.startsWith('+')) {
      return {
        country: null,
        nationalNumber: cleaned,
        dialCode: ''
      };
    }
    
    // Try to match dial codes (longest first)
    const allDialCodes = this.getAllCountries()
      .map(c => c.dialCode.replace(/^\+/, ''))
      .sort((a, b) => b.length - a.length);
    
    for (const code of allDialCodes) {
      if (cleaned.substring(1).startsWith(code)) {
        const country = this.getCountryByDialCode(code);
        return {
          country,
          nationalNumber: cleaned.substring(1 + code.length),
          dialCode: '+' + code
        };
      }
    }
    
    return {
      country: null,
      nationalNumber: cleaned.substring(1),
      dialCode: ''
    };
  }
  
  // Format phone number for country
  static formatPhoneNumber(phoneNumber: string, countryCode: ICountryCode): string {
    const country = this.getCountry(countryCode);
    if (!country) return phoneNumber;
    
    const parsed = this.parsePhoneNumber(phoneNumber);
    if (parsed.country?.code === countryCode) {
      // Already has correct country code
      return phoneNumber;
    }
    
    // Add country dial code
    const nationalNumber = phoneNumber.replace(/^\+?\d+/, '').replace(/^0+/, '');
    return `${country.dialCode}${nationalNumber}`;
  }
}

// Usage examples
const usaByPhone = CountriesManager.getCountryByDialCode('+1');
const parsed = CountriesManager.parsePhoneNumber('+33123456789');
console.log(parsed);
/*
{
  country: { code: 'FR', name: 'France', ... },
  nationalNumber: '123456789',
  dialCode: '+33'
}
*/

const formatted = CountriesManager.formatPhoneNumber('123456789', 'FR');
console.log(formatted); // '+33123456789'
```

---

## 🌍 Geographic Utilities

### **Geographic Calculations**

```typescript
class GeographicUtils {
  // Calculate distance between two countries (using capitals)
  static calculateDistance(country1: ICountryCode, country2: ICountryCode): number | null {
    const c1 = CountriesManager.getCountry(country1);
    const c2 = CountriesManager.getCountry(country2);
    
    if (!c1?.coordinates || !c2?.coordinates) return null;
    
    return this.haversineDistance(
      c1.coordinates.lat, c1.coordinates.lng,
      c2.coordinates.lat, c2.coordinates.lng
    );
  }
  
  // Haversine formula for distance calculation
  private static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  // Get neighboring countries
  static getNeighbors(countryCode: ICountryCode): ICountry[] {
    const country = CountriesManager.getCountry(countryCode);
    if (!country?.borders) return [];
    
    return country.borders
      .map(code => CountriesManager.getCountry(code))
      .filter(Boolean) as ICountry[];
  }
  
  // Get countries within radius
  static getCountriesWithinRadius(
    centerCountry: ICountryCode, 
    radiusKm: number
  ): Array<{ country: ICountry; distance: number }> {
    const center = CountriesManager.getCountry(centerCountry);
    if (!center?.coordinates) return [];
    
    return CountriesManager.getAllCountries()
      .map(country => {
        if (!country.coordinates || country.code === centerCountry) return null;
        
        const distance = this.haversineDistance(
          center.coordinates!.lat, center.coordinates!.lng,
          country.coordinates.lat, country.coordinates.lng
        );
        
        return distance <= radiusKm ? { country, distance } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a!.distance - b!.distance) as Array<{ country: ICountry; distance: number }>;
  }
}

// Usage examples
const distance = GeographicUtils.calculateDistance('FR', 'DE'); // ~500km
const neighbors = GeographicUtils.getNeighbors('CH'); // [AT, FR, DE, IT, LI]
const nearby = GeographicUtils.getCountriesWithinRadius('LU', 500);
```

---

## 🏛️ Country Administration

### **Custom Country Management**

```typescript
class CountriesManager {
  // Add or update country
  static setCountry(country: ICountry): void {
    if (!this.isValidCountry(country)) {
      throw new Error('Invalid country object');
    }
    
    this.countries[country.code] = country;
  }
  
  // Remove country
  static removeCountry(code: ICountryCode): boolean {
    if (this.hasCountry(code)) {
      delete this.countries[code];
      return true;
    }
    return false;
  }
  
  // Update country properties
  static updateCountry(code: ICountryCode, updates: Partial<ICountry>): boolean {
    const country = this.getCountry(code);
    if (!country) return false;
    
    this.countries[code] = { ...country, ...updates };
    return true;
  }
  
  // Bulk import countries
  static importCountries(countries: ICountry[]): { success: number; failed: number } {
    let success = 0;
    let failed = 0;
    
    countries.forEach(country => {
      try {
        this.setCountry(country);
        success++;
      } catch {
        failed++;
      }
    });
    
    return { success, failed };
  }
  
  // Export countries data
  static exportCountries(format: 'json' | 'csv' = 'json'): string {
    const countries = this.getAllCountries();
    
    if (format === 'json') {
      return JSON.stringify(countries, null, 2);
    }
    
    // CSV format
    const headers = ['code', 'name', 'dialCode', 'currency', 'continent', 'capital'];
    const csvRows = [
      headers.join(','),
      ...countries.map(country => 
        headers.map(header => 
          JSON.stringify(country[header as keyof ICountry] || '')
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
}

// Usage examples
const customCountry: ICountry = {
  code: 'XX' as ICountryCode,
  name: 'Custom Country',
  dialCode: '+999',
  flag: '🏴‍☠️',
  currency: 'XCC'
};

CountriesManager.setCountry(customCountry);
CountriesManager.updateCountry('US', { population: 331000000 });
const exported = CountriesManager.exportCountries('csv');
```

---

## 🌐 Internationalization Integration

### **Localized Country Names**

```typescript
import { I18n } from '@resk/core/i18n';

class LocalizedCountries {
  // Get localized country name
  static getLocalizedName(countryCode: ICountryCode, locale?: string): string {
    const country = CountriesManager.getCountry(countryCode);
    if (!country) return '';
    
    const currentLocale = locale || I18n.locale;
    const translationKey = `countries.${countryCode.toLowerCase()}`;
    
    // Try to get translated name
    const translatedName = I18n.t(translationKey, { defaultValue: null });
    
    // Fallback to English name
    return translatedName || country.name;
  }
  
  // Get all countries with localized names
  static getAllLocalizedCountries(locale?: string): Array<{
    code: ICountryCode;
    name: string;
    localizedName: string;
  }> {
    return CountriesManager.getAllCountries().map(country => ({
      code: country.code,
      name: country.name,
      localizedName: this.getLocalizedName(country.code, locale)
    }));
  }
  
  // Search countries by localized name
  static searchLocalizedCountries(query: string, locale?: string): ICountry[] {
    const localizedCountries = this.getAllLocalizedCountries(locale);
    const lowerQuery = query.toLowerCase();
    
    return localizedCountries
      .filter(item => 
        item.localizedName.toLowerCase().includes(lowerQuery) ||
        item.name.toLowerCase().includes(lowerQuery)
      )
      .map(item => CountriesManager.getCountry(item.code))
      .filter(Boolean) as ICountry[];
  }
}

// Translation setup
const countryTranslations = {
  en: {
    countries: {
      us: 'United States',
      fr: 'France',
      de: 'Germany',
      jp: 'Japan'
    }
  },
  fr: {
    countries: {
      us: 'États-Unis',
      fr: 'France',
      de: 'Allemagne',
      jp: 'Japon'
    }
  },
  es: {
    countries: {
      us: 'Estados Unidos',
      fr: 'Francia',
      de: 'Alemania',
      jp: 'Japón'
    }
  }
};

// Usage
I18n.store(countryTranslations);
I18n.locale = 'fr';

const localizedName = LocalizedCountries.getLocalizedName('US'); // 'États-Unis'
const searchResults = LocalizedCountries.searchLocalizedCountries('états');
```

---

## 🎯 Real-World Examples

### **Country Selector Component**

```typescript
class CountrySelector {
  private countries: ICountry[];
  private filteredCountries: ICountry[];
  private selectedCountry: ICountry | null = null;
  
  constructor(options: {
    allowSearch?: boolean;
    showFlags?: boolean;
    showDialCodes?: boolean;
    continents?: string[];
    excludeCountries?: ICountryCode[];
  } = {}) {
    this.countries = this.filterCountries(options);
    this.filteredCountries = [...this.countries];
  }
  
  private filterCountries(options: any): ICountry[] {
    let countries = CountriesManager.getAllCountries();
    
    // Filter by continents
    if (options.continents?.length) {
      countries = countries.filter(country => 
        options.continents.includes(country.continent)
      );
    }
    
    // Exclude specific countries
    if (options.excludeCountries?.length) {
      countries = countries.filter(country => 
        !options.excludeCountries.includes(country.code)
      );
    }
    
    // Sort alphabetically
    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  search(query: string): void {
    if (!query.trim()) {
      this.filteredCountries = [...this.countries];
      return;
    }
    
    this.filteredCountries = CountriesManager.searchCountries(query)
      .filter(country => this.countries.includes(country));
  }
  
  selectCountry(code: ICountryCode): void {
    this.selectedCountry = CountriesManager.getCountry(code);
  }
  
  getSelectedCountry(): ICountry | null {
    return this.selectedCountry;
  }
  
  getFilteredCountries(): ICountry[] {
    return this.filteredCountries;
  }
  
  renderOptions(): string[] {
    return this.filteredCountries.map(country => 
      `${country.flag} ${country.name} (${country.dialCode})`
    );
  }
}

// Usage
const selector = new CountrySelector({
  continents: ['Europe', 'North America'],
  showFlags: true,
  showDialCodes: true
});

selector.search('united');
selector.selectCountry('US');
const selected = selector.getSelectedCountry();
```

### **Phone Number Input with Country Detection**

```typescript
class PhoneNumberInput {
  private country: ICountry | null = null;
  private nationalNumber: string = '';
  
  setPhoneNumber(phoneNumber: string): void {
    const parsed = CountriesManager.parsePhoneNumber(phoneNumber);
    
    this.country = parsed.country;
    this.nationalNumber = parsed.nationalNumber;
    
    this.updateUI();
  }
  
  setCountry(countryCode: ICountryCode): void {
    this.country = CountriesManager.getCountry(countryCode);
    this.updateUI();
  }
  
  getFormattedNumber(): string {
    if (!this.country || !this.nationalNumber) return this.nationalNumber;
    
    return `${this.country.dialCode}${this.nationalNumber}`;
  }
  
  getInternationalFormat(): string {
    const formatted = this.getFormattedNumber();
    return formatted.startsWith('+') ? formatted : `+${formatted}`;
  }
  
  isValid(): boolean {
    return !!(this.country && this.nationalNumber && this.nationalNumber.length >= 7);
  }
  
  private updateUI(): void {
    // Update country flag display
    const flagElement = document.getElementById('country-flag');
    if (flagElement && this.country) {
      flagElement.textContent = this.country.flag;
    }
    
    // Update dial code display
    const dialCodeElement = document.getElementById('dial-code');
    if (dialCodeElement && this.country) {
      dialCodeElement.textContent = this.country.dialCode;
    }
    
    // Update validation status
    const validationElement = document.getElementById('validation-status');
    if (validationElement) {
      validationElement.textContent = this.isValid() ? '✓' : '✗';
    }
  }
}

// Usage
const phoneInput = new PhoneNumberInput();
phoneInput.setPhoneNumber('+33123456789');
console.log(phoneInput.getInternationalFormat()); // '+33123456789'
console.log(phoneInput.isValid()); // true
```

---

## 🎯 Best Practices

### **1. Performance Optimization**
```typescript
// ✅ Good: Cache frequently accessed data
const cachedCountries = CountriesManager.getAllCountries();

// ✅ Good: Use specific search methods
const europeanCountries = CountriesManager.getCountriesByContinent('Europe');

// ❌ Avoid: Repeated full country list iterations
CountriesManager.getAllCountries().filter(c => c.continent === 'Europe');
```

### **2. User Experience**
```typescript
// ✅ Good: Provide search and filtering
const searchResults = CountriesManager.searchCountries(userQuery);

// ✅ Good: Show localized names
const localizedName = LocalizedCountries.getLocalizedName('US');

// ✅ Good: Include visual indicators
const displayName = `${country.flag} ${country.name}`;
```

### **3. Data Validation**
```typescript
// ✅ Good: Validate before operations
if (CountriesManager.hasCountry(code)) {
  const country = CountriesManager.getCountry(code);
}

// ✅ Good: Handle phone number parsing safely
const parsed = CountriesManager.parsePhoneNumber(input);
if (parsed.country) {
  // Process with valid country
}
```

---

The Countries module provides comprehensive country data management with utilities for search, validation, geographic calculations, and internationalization support.
