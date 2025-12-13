
import React from 'react';
import { clsx } from 'clsx';
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe, Mail } from 'lucide-react';
import type { FormElement } from '../../../../types';
import { useStore } from '../../../../store/useStore';

const iconMap: Record<string, React.ElementType> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
    youtube: Youtube,
    website: Globe,
    email: Mail
};

export const SocialComponent: React.FC<{ element: FormElement }> = ({ element }) => {
    const { settings } = useStore();
    const socialLinks = element.socialLinks || [];
    const alignClass =
        element.justifyContent === 'center' ? 'justify-center' :
            element.justifyContent === 'flex-end' ? 'justify-end' :
                element.justifyContent === 'space-between' ? 'justify-between' :
                    'justify-start';

    // Apply default color if no global overrides
    const useDefaultColor = !element.textColor && !settings.textColor && !settings.formBackground;

    if (!socialLinks.length) {
        return (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <p>No social links configured</p>
            </div>
        );
    }

    const useDefaultBg = !element.backgroundColor && !settings.formBackground;

    return (
        <div
            className={clsx("flex flex-wrap gap-4", alignClass)}
            style={{
                gap: element.gap || '16px'
            }}
        >
            {socialLinks.map((link, index) => {
                const Icon = iconMap[link.icon || link.platform] || Globe;
                return (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx(
                            "flex items-center justify-center transition-colors duration-200",
                            useDefaultColor && "text-gray-600 hover:text-brand-600",
                            useDefaultBg && element.buttonStyle === 'primary' && "bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700",
                            // Outline should probably stay outline? But if BG is inherited...
                            // Outline has bg-transparent anyway. So `useDefaultBg` doesn't change much except ignoring it?
                            // Actually outline adds BORDER.
                            // Does global BG imply removing Border? Likely not.
                            // But for consistency let's stick to the Primary logic which was the main offender.
                            element.buttonStyle === 'outline' && "border border-gray-300 p-2 rounded-full hover:border-brand-600 hover:text-brand-600",
                            !element.buttonStyle && "p-1"
                        )}
                        style={{
                            color: element.textColor || undefined,
                            backgroundColor: element.buttonStyle === 'primary' ? element.backgroundColor : undefined,
                            borderColor: element.buttonStyle === 'outline' ? element.textColor : undefined
                        }}
                    >
                        <Icon size={element.fontSize || 24} />
                    </a>
                );
            })}
        </div>
    );
};
