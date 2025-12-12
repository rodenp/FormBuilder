
import React from 'react';
import { clsx } from 'clsx';
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe, Mail } from 'lucide-react';
import type { FormElement } from '../../../../types';

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
    const socialLinks = element.socialLinks || [];
    const alignClass =
        element.justifyContent === 'center' ? 'justify-center' :
            element.justifyContent === 'flex-end' ? 'justify-end' :
                element.justifyContent === 'space-between' ? 'justify-between' :
                    'justify-start';

    if (!socialLinks.length) {
        return (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <p>No social links configured</p>
            </div>
        );
    }

    return (
        <div
            className={clsx("flex flex-wrap gap-4", alignClass)}
            style={{
                gap: `${element.gap !== undefined ? element.gap : 16}px`
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
                            "text-gray-600 hover:text-blue-600",
                            element.buttonStyle === 'primary' && "bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700",
                            element.buttonStyle === 'outline' && "border border-gray-300 p-2 rounded-full hover:border-blue-600 hover:text-blue-600",
                            !element.buttonStyle && "p-1"
                        )}
                        style={{
                            color: element.textColor,
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
