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
import { motion } from 'framer-motion'

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

    return (
        <div className='py-100 bg-[#F4F4F4] overflow-hidden relative'>
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#A8DD15 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className='max-w-[1640px] px-5 mx-auto max-laptop:px-16 max-tab:px-5 max-mobile:px-4 relative z-10'>
                <div className='grid grid-cols-[1fr_600px] gap-20 items-center max-laptop:grid-cols-1 max-laptop:gap-12'>
                    <div>
                        <div className='pb-3'>
                            <button className='bg-white border-none rounded-full py-2 px-4 text-sm font-medium text-black700 shadow-sm'>
                                Contact Us
                            </button>
                        </div>
                        <h2 className='text-[54px] max-mobile:text-3xl leading-[1.1] text-black100 font-bold mb-6'>
                            Let's Build Something <br />
                            Smarter Together
                        </h2>
                        <p className='text-xl max-mobile:text-lg text-black700 font-medium max-w-[600px] mb-10'>
                            Discover how our solutions can streamline your workflow, boost performance, and help your business grow faster. Fill out the form and our team will get in touch shortly.
                        </p>

                        <div className='flex flex-col gap-5'>
                            {features.map((feature, i) => (
                                <div key={i} className='flex items-center gap-3'>
                                    <div className='w-6 h-6 flex items-center justify-center'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#A8DD15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className='text-lg font-semibold text-black100'>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className='bg-white p-10 rounded-[32px] shadow-[0_10px_50px_rgba(0,0,0,0.05)] max-mobile:p-6'
                    >
                        <Form {...form}>
                            <form onSubmit={handleSubmitWithAction} className='flex flex-col gap-6'>
                                <Controller
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-bold mb-2 block text-base">
                                                Name
                                            </FieldLabel>
                                            <Input 
                                                id={field.name} 
                                                placeholder="John Doe" 
                                                className="bg-white border-border-light300 h-14 rounded-xl px-5" 
                                                {...field} 
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Field data-invalid={!!form.formState.errors.phone}>
                                    <FieldLabel className="text-black100 font-bold mb-2 block text-base">
                                        Phone Number
                                    </FieldLabel>
                                    <div className="grid grid-cols-[120px_1fr] gap-3 h-14">
                                        <Select 
                                            value={selectedCountry.code} 
                                            onValueChange={(val) => {
                                                const country = countries.find(c => c.code === val);
                                                if (country) setSelectedCountry(country);
                                            }}
                                        >
                                            <SelectTrigger className="flex items-center gap-2 px-3 border border-border-light300 rounded-xl h-full bg-white w-full focus:ring-0">
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
                                            className="bg-white border-border-light300 h-full rounded-xl px-5" 
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
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-bold mb-2 block text-base">
                                                Email
                                            </FieldLabel>
                                            <Input 
                                                id={field.name} 
                                                type="email" 
                                                placeholder="John Doe@gmai.com" 
                                                className="bg-white border-border-light300 h-14 rounded-xl px-5" 
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
                                            <FieldLabel htmlFor={field.name} className="text-black100 font-bold mb-2 block text-base">
                                                Message
                                            </FieldLabel>
                                            <TextArea 
                                                id={field.name} 
                                                placeholder="Your message" 
                                                className="bg-white border-border-light300 rounded-xl px-5 py-4 min-h-[120px]" 
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
                                        className="w-full h-14 rounded-xl bg-black100 hover:bg-black font-bold text-white flex items-center justify-center gap-2 group"
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

                                <p className='text-center text-black700 font-medium text-sm'>
                                    By continuing i accept the <Link href="/privacy" className='underline decoration-black100 text-black100'>Privacy Policy</Link>
                                </p>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
