import React from 'react';

import Hero from '../hero/hero';
import Features from '../features/features';
import HowItWorks from '../howItWorks/howItWorks';
import Demo from '../demo/demo';
import Community from '../community/community';

function home() {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <Demo />
            <Community />
        </>
    );
};

export default home;