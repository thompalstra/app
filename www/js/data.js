var data = {
    // timestamp of the current day
    1505822400 : {
        // appointment object
        34: {
            completed: false,
            walking_time: '00:45:00',
            unreachable: false,
            time: "13:30",
            signatures: {
                customer: null,
                inspector: null
            },
            information: "Extra bezoek na overlast",
            debtor: {
                name: 'Albert Heijn',
                debtor_number: 1000,
                branch_code: 'AT1000',
                invoice_address: 'Factuurlaan',
                invoice_house_number: '1',
                invoice_addition: 'H',
                invoice_postcode: '9999AZ',
                invoice_city: 'Heerhugowaard',
                visit_address: 'Bezoeklaan',
                visit_house_number: '1',
                visit_addition: '-1',
                visit_postcode: '1337GG',
                visit_city: 'Rotterdam',
                phone_number: '0887779500',
                email: 'info@ah-heerhugowaard.nl',
                payment_method: 'Contract',
                times: {
                	1: {
                		from: '09:00',
                		to: '18:00'
                	},
                	2: {
                		from: '09:00',
                		to: '18:00'
                	},
                    3: {
                        from: '09:00',
                        to: '17:00'
                    },
                    4: {
                        from: '09:00',
                		to: '18:00'
                    },
                    5: {
                        from: '09:00',
                		to: '21:00'
                    }
                }
            },
            checkpoints: {
                32563: {
                    name: 'Rattenvanger Ultra MK3000Plus V2.0.1',
                    type: 'Rat',
                    code: '3STWUW007886595',
                    questions: {
                        0: {
                            question: 'Hoeveel gif is er op?',
                            type: 5,
                            answered: false,
                            required: true,
                            answer: undefined,
                            products: {
                                12: "Gif 1.5 gr.",
                                23: "Gif 1.8 gr.",
                                54: "Gif 2 gr."
                            },
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '23%',
                        y: '83%',
                        path: 'logo_00.jpg'
                    },
                },
                37: {
                    name: 'De keuken',
                    type: 'Rat',
                    code: 'CODEA000',
                    questions: {
                        0: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        2: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        62: {
                            question: "Dit is een vraag met een getal als antwoord",
                            type: 3,
                            min_value: 10,
                            max_value: 99,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        415: {
                            question: "Hoe zou je dit omschrijven?",
                            type: 1,
                            min_value: 0,
                            max_value: 0,
                            answered: false,
                            required: true,
                            answer: undefined,
                            choices: {
                                4331: "Als een antwoord",
                                4332: "Als een tweede antwoord",
                                4333: "Als dit het derde antwoord is",
                                4334: "Wanneer het ID van dit antwoord 4334 is",
                            },
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '50%',
                        y: '50%',
                        path: 'logo_00.jpg'
                    },
                },
                231: {
                    name: 'Kopstelling A',
                    type: 'Mier',
                    code: 'CODEB001',
                    questions: {
                        3: {
                            question: 'Dit is een vraag',
                            type: 4,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        },
                        4: {
                            question: 'Dit is nog een vraag',
                            type: 2,
                            answered: false,
                            required: true,
                            answer: undefined,
                            errors: [],
                        }
                    },
                    floorplan: {
                        x: '83%',
                        y: '23%',
                        path: 'logo_00.jpg'
                    },
                }
            },
            service_types:{
                1: {
                    name: 'Hygiëne',
                    remarks: 'Test servicetype begane grond',
                    state: null,
                    additional_questions: {
                        // status
                        on: 2,
                        questions: {
                            99944: {
                                question: 'Dit is een extra vraag',
                                type: 4,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            },
                            99945: {
                                question: 'Dit is nog een extra vraag',
                                type: 2,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            }
                        },
                    }
                },
                3261: {
                    name: 'Muizen',
                    remarks: 'Test servicetype begane grond',
                    state: null,
                    additional_questions: {
                        // status
                        on: 3,
                        questions: {
                            99955: {
                                question: 'Dit is een extra vraag',
                                type: 4,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            },
                            99956: {
                                question: 'Dit is nog een extra vraag',
                                type: 2,
                                answered: false,
                                required: true,
                                answer: undefined,
                                errors: [],
                            }
                        },
                    }
                }
            },
            floorplan: {
                0: {
                    path: 'map_56.jpg',
                    name: 'Vloerplan 56'
                },
                1: {
                    path: 'map_57.jpg',
                    name: 'Vloeplan 57'
                }
            },
            remarks: [
                {
                    id: 1,
                    name: "Dit is een opmerking",
                    actionee: "Attack",
                    group: "Algemeen",
                    type: "Klacht",
                    complete: false
                },
            ]
        },
    },
};
