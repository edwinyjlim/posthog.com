import { CallToAction } from 'components/CallToAction'
import React, { useCallback } from 'react'
import { createCartQuery, getCartQuery } from '../../lib/shopify'
import { cn } from '../../utils'
import { AdjustedLineItems } from './AdjustedLineItems'
import { LoaderIcon } from './LoaderIcon'
import { useCartStore } from './store'
import type { AdjustedLineItem, Cart } from './types'
import { getAvailableQuantity, getCartVariables } from './utils'
import { graphql, useStaticQuery } from 'gatsby'

type CheckoutProps = {
    className?: string
    isEmpty?: boolean
}
function notNull<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}

export function getCheckoutUrl(cart: Cart | null, couponCode: string | null): string | null {
    const checkoutUrl = cart?.checkoutUrl

    if (!checkoutUrl) {
        return null
    }

    if (couponCode) {
        const url = new URL(checkoutUrl)
        url.searchParams.set('discount', couponCode)
        return url.toString()
    }

    return checkoutUrl
}

export function Checkout(props: CheckoutProps): React.ReactElement {
    const { className, isEmpty } = props
    const [adjustedItems, setAdjustedItems] = React.useState<AdjustedLineItem[]>([])
    const { cartItems, setCartItems, removeAll, cartId, setCartId } = useCartStore((state) => ({
        cartItems: state.cartItems,
        setCartItems: state.setCartItems,
        removeAll: state.removeAll,
        cartId: state.cartId,
        setCartId: state.setCartId,
    }))
    const [isCheckingOut, setIsCheckingOut] = React.useState(false)
    const [showAdjustments, setShowAdjustments] = React.useState(false)
    const discountCode = useCartStore((state) => state.discountCode)
    const { allProducts } = useStaticQuery(graphql`
        {
            allProducts: allShopifyProduct {
                nodes {
                    variants {
                        shopifyId
                        inventoryPolicy
                    }
                }
            }
        }
    `)

    const handleCheckout = useCallback(() => {
        setIsCheckingOut(true)
        setShowAdjustments(false)
        async function checkoutMutation() {
            setIsCheckingOut(true)

            let cart: Cart | null = null

            if (cartId) {
                cart = (await getCartQuery(cartId)) as Cart
            }

            if (!cart) {
                const createCartVariables = getCartVariables(cartItems)
                cart = (await createCartQuery(createCartVariables)) as Cart
                const newCartId = cart.id
                setCartId(newCartId)
            }

            const itemsExceedingQuantityAvailable: AdjustedLineItem[] = []

            if (cart === null) return

            for (const item of cartItems) {
                if (item.product.tags.includes('digital')) {
                    continue
                }
                const continueSelling = allProducts.nodes.some((p: any) =>
                    p.variants.some(
                        (variant: any) =>
                            variant.shopifyId === item.shopifyId && variant.inventoryPolicy.toLowerCase() === 'continue'
                    )
                )

                if (continueSelling) {
                    continue
                }

                // first check if it's available for sale. If not, then add to the list
                // with flag for removal from cart
                const quantityAvailable = item.kit ? 100 : await getAvailableQuantity(item.shopifyId)

                // if it is available for sale, then check if the quantity available is less than
                // the quantity in the cart. If so, then add to the list with the new quantity
                if (quantityAvailable < item.count) {
                    if (quantityAvailable <= 0) {
                        // if the new quantity available is zero, remove
                        itemsExceedingQuantityAvailable.push({
                            item,
                            remove: true,
                            newCount: quantityAvailable,
                        })
                    } else {
                        itemsExceedingQuantityAvailable.push({
                            item,
                            remove: false,
                            newCount: quantityAvailable,
                        })
                    }
                }
            }

            if (itemsExceedingQuantityAvailable.length > 0) {
                setAdjustedItems(itemsExceedingQuantityAvailable)
                setIsCheckingOut(false)
            }
            setShowAdjustments(itemsExceedingQuantityAvailable.length > 0)
            if (itemsExceedingQuantityAvailable.length > 0) {
                const newCartItems = cartItems
                    .map((item) => {
                        const matchingItem = itemsExceedingQuantityAvailable.find((exceedingItem) => {
                            return exceedingItem.item.shopifyId === item.shopifyId
                        })
                        if (!matchingItem) {
                            return item
                        }
                        if (matchingItem.remove) {
                            return null
                        }
                        return {
                            ...item,
                            count: matchingItem.newCount as number,
                        }
                    })
                    .filter(notNull)
                setCartItems(newCartItems ?? [])
                setIsCheckingOut(false)
                return
            }

            const checkoutUrl = getCheckoutUrl(cart, discountCode)
            if (checkoutUrl) {
                window.location.href = checkoutUrl
            }
        }
        checkoutMutation()
    }, [setIsCheckingOut, discountCode, cartItems])

    const classes = cn(
        'rounded-md px-3.5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
        className
    )

    return (
        <div className={classes}>
            {adjustedItems.length > 0 && <AdjustedLineItems className="my-4" lineItems={adjustedItems} />}

            {!isEmpty && (
                <div className="flex justify-end">
                    <CallToAction
                        onClick={handleCheckout}
                        type="primary"
                        className={cn('relative text-center w-full', className)}
                    >
                        <>
                            <span className={cn('mx-16', showAdjustments && 'invisible', isCheckingOut && 'invisible')}>
                                Checkout
                            </span>
                            <span
                                className={cn(
                                    'invisible absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full',
                                    showAdjustments && 'visible',
                                    isCheckingOut && 'invisible'
                                )}
                            >
                                Proceed to Checkout
                            </span>
                            <LoaderIcon
                                className={cn(
                                    'invisible absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
                                    !showAdjustments && isCheckingOut && 'visible'
                                )}
                            />
                        </>
                    </CallToAction>
                </div>
            )}
        </div>
    )
}
