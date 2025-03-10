import React from 'react';
import Image from 'next/image';

const Contact = () => {
  const contactInfo = [
    {
      id: 1,
      type: 'email',
      value: 'contact@jeremie-m.dev',
      icon: '/images/email.png',
      link: 'mailto:contact@jeremie-m.dev',
      isUnderlined: true,
    },
    {
      id: 2,
      type: 'discord',
      value: '__Putre__',
      icon: '/images/discord.png',
      link: 'https://discord.com/users/__Putre__',
      isUnderlined: false,
    },
    {
      id: 3,
      type: 'twitter',
      value: 'wpzputre',
      icon: '/images/twitter.png',
      link: 'https://twitter.com/wpzputre',
      isUnderlined: false,
    },
    {
      id: 4,
      type: 'github',
      value: 'github.com/jeremie-m',
      icon: '/images/github.png',
      link: 'https://github.com/jeremie-m',
      isUnderlined: false,
    },
  ];

  return (
    <section id="contact" className="flex flex-col justify-between items-center self-stretch h-[270px] px-5 py-8">
      <h2 className="font-medium text-[24px] leading-[16px] text-center text-white mb-8">
        Contact
      </h2>
      
      <div className="w-full flex flex-col gap-4">
        {contactInfo.map((item) => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-between items-center w-full"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              {/* Remplacer par vos propres images */}
              {/* <Image src={item.icon} alt={item.type} width={24} height={24} /> */}
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                {item.type.substring(0, 1).toUpperCase()}
              </div>
            </div>
            <span className={`font-medium text-[14px] leading-[16px] text-right ${item.isUnderlined ? 'underline' : ''} text-white`}>
              {item.value}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact; 