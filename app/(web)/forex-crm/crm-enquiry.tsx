"use client"

import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { Controller, FormProvider as Form } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Input } from "~/components/common/input"
import { TextArea } from "~/components/common/textarea"
import { Field, FieldError, FieldLabel } from "~/components/common/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/common/select"
import { submitCrmEnquiry } from "~/server/web/actions/crm-enquiry"
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import Arrow from '~/components/common/icons/arrow'

const crmEnquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Invalid phone number"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

const features = [
    "Custom solutions tailored to your business",
    "Fast integration and smooth onboarding",
    "Real-time analytics & performance tracking",
    "Secure, scalable, and modern technology"
];

const countries = [
    { code: '+91', name: 'India', flag: 'in' },
    { code: '+1', name: 'USA', flag: 'us' },
    { code: '+44', name: 'UK', flag: 'gb' },
    { code: '+971', name: 'UAE', flag: 'ae' },
    { code: '+65', name: 'Singapore', flag: 'sg' },
    { code: '+61', name: 'Australia', flag: 'au' },
    { code: '+49', name: 'Germany', flag: 'de' },
    { code: '+33', name: 'France', flag: 'fr' },
    { code: '+81', name: 'Japan', flag: 'jp' },
    { code: '+86', name: 'China', flag: 'cn' },
];

export default function CrmEnquiry() {
    const resolver = zodResolver(crmEnquirySchema)
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { form, action, handleSubmitWithAction } = useHookFormAction(submitCrmEnquiry, resolver, {
        formProps: {
            defaultValues: {
                name: "",
                email: "",
                phone: "",
                message: "",
            },
        },
        actionProps: {
            onSuccess: ({ data }) => {
                toast.success(data)
                form.reset()
                setPhoneNumber('')
            },
            onError: ({ error }) => {
                toast.error(error.serverError || "Failed to submit enquiry")
            },
        },
    })

    // Update the hidden/controlled phone field when country or number changes
    useEffect(() => {
        if (phoneNumber) {
            form.setValue('phone', `${selectedCountry.code} ${phoneNumber}`, { shouldValidate: true });
        } else {
            form.setValue('phone', '');
        }
    }, [selectedCountry, phoneNumber, form]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const formVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.4
            }
        }
    };

    return (
        <div id="crm-enquiry-section" className='pb-100  scroll-mt-[130px] max-mobile:py-16 max-mobile:pt-0 overflow-hidden relative'>
            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 relative z-10'>
                <div className='grid grid-cols-[1fr_600px] max-tab:grid-cols-1 gap-10'>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants} className='pb-3'>
                            <button className='bg-white border-none rounded-full py-2 px-4 text-base font-medium text-black700'>
                                Contact Us
                            </button>
                        </motion.div>
                        <motion.h2 variants={itemVariants} className='text-[42px] max-mobile:text-3xl leading-normal text-black100 font-bold max-w-[596px]'>
                            Let’s Build Something Smarter Together
                        </motion.h2>
                        <motion.p variants={itemVariants} className='text-lg max-mobile:text-base text-black700 font-medium max-w-[641px] whitespace-pre-line '>
                            Discover how our solutions can streamline your workflow, boost performance, and help your business grow faster. Fill out the form
                            and our team will get in touch shortly.
                        </motion.p>
                        <div className='pt-10 grid grid-cols-1 gap-6'>
                            {[
                                "Custom solutions tailored to your business",
                                "Fast integration and smooth onboarding",
                                "Real-time analytics & performance tracking",
                                "Secure, scalable, and modern technology"
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className='grid grid-cols-[26px_1fr] gap-2.5'
                                >
                                    <Arrow />
                                    <span className='text-lg max-mobile:text-base font-medium text-black700'>
                                        {feature}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        variants={formVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className='bg-white rounded-xl p-6 max-mobile:p-4'>
                            <form onSubmit={handleSubmitWithAction} className='grid grid-cols-1 gap-5'>
                                <Controller
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-medium block text-base">
                                                Name <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                placeholder="John Doe"
                                                className="bg-white placeholder:text-base text-base border-border-light180 h-[50px] rounded-full px-5"
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Field data-invalid={!!form.formState.errors.phone}>
                                    <FieldLabel className="text-black100 font-medium block text-base">
                                        Phone Number <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <div className="grid grid-cols-[120px_1fr] gap-3 h-14">
                                        <Select
                                            value={selectedCountry.code}
                                            onValueChange={(val) => {
                                                const country = countries.find(c => c.code === val);
                                                if (country) setSelectedCountry(country);
                                            }}
                                        >
                                            <SelectTrigger className="flex items-center gap-2 px-3 border border-border-light180 rounded-full h-[50px] bg-white w-full focus:ring-0">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt={selectedCountry.name} className="w-5 shrink-0" />
                                                    <span className="text-black700 font-medium truncate">{selectedCountry.code}</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border-light300 rounded-xl max-h-[300px] z-[100]">
                                                {countries.map((c) => (
                                                    <SelectItem key={c.code} value={c.code} className="hover:bg-primary/10">
                                                        <div className="flex items-center gap-2">
                                                            <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt={c.name} className="w-5" />
                                                            <span>{c.name} ({c.code})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Enter mobile number"
                                            className="bg-white placeholder:text-base text-base border-border-light180 h-[50px] rounded-full px-5"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    {form.formState.errors.phone && <FieldError errors={[form.formState.errors.phone]} />}
                                </Field>

                                <Controller
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-medium block text-base">
                                                Email <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                type="email"
                                                placeholder="John Doe@gmai.com"
                                                className="bg-white placeholder:text-base text-base border-border-light180 h-[50px] rounded-full px-5"
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="message"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-medium block text-base">
                                                                                                Message <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <TextArea
                                                id={field.name}
                                                placeholder="Your message"
                                                className="bg-white placeholder:text-base text-base border-border-light180 rounded-2xl px-5 py-4 min-h-[120px]"
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <div className='pt-2'>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full group"
                                        isPending={action.isPending}
                                    >
                                        Send
                                        <div className="w-7 h-7 rounded-full flex items-center group-hover:bg-white transition-all duration-300 justify-center bg-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94141L17.0837 9.99974L12.0254 15.0581" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.91699 10H16.942" stroke="#1A1A1A" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </Button>
                                </div>

                                <p className='text-center text-black100 text-base font-normal'>
                                    By continuing I accept the <Link href="/privacy" className='underline decoration-black100 text-black700 font-medium'>Privacy Policy</Link>
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
